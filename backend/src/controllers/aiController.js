const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const TRANSLATE_MODEL = "claude-haiku-4-5-20251001";
const OCR_MODEL = "claude-haiku-4-5-20251001";

const targetLangNameOf = (targetLang) =>
  targetLang === "en" ? "English" : "Vietnamese";

// POST /api/ai/translate  { text, targetLang } -> { translatedText, isMock }
export const translateText = async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({ message: "Missing text or targetLang" });
    }

    const rawKey = process.env.ANTHROPIC_API_KEY;
    // Only treat it as a real key if it looks like one (lets the free path run with the placeholder)
    const apiKey = rawKey && rawKey.startsWith("sk-") ? rawKey : null;
    const targetLangName = targetLangNameOf(targetLang);

    // Free fallback (no API key needed): MyMemory translation API.
    // Source language is taken as the opposite of the target, which fits a
    // two-way English/Vietnamese chat.
    if (!apiKey) {
      const sourceLang = targetLang === "en" ? "vi" : "en";
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${sourceLang}|${targetLang}`;

      const freeRes = await fetch(url);
      const freeData = await freeRes.json();
      const translated = freeData?.responseData?.translatedText || text;

      return res
        .status(200)
        .json({ translatedText: translated, isMock: false, provider: "mymemory" });
    }

    const response = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: TRANSLATE_MODEL,
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `Translate the following text to ${targetLangName}. Output ONLY the translated text, nothing else. No explanations, no quotes.\n\nText: ${text}`,
          },
        ],
      }),
    });

    const data = await response.json();
    const translatedText = data?.content?.[0]?.text?.trim() ?? text;

    return res.status(200).json({ translatedText, isMock: false });
  } catch (error) {
    console.error("An error occurred while translating text", error);
    return res.status(500).json({ message: "Translation failed" });
  }
};

// POST /api/ai/ocr  { imageBase64, targetLang } -> { blocks, isMock } | { noText }
export const ocrImage = async (req, res) => {
  try {
    const { imageBase64, targetLang } = req.body;

    if (!imageBase64 || !targetLang) {
      return res
        .status(400)
        .json({ message: "Missing imageBase64 or targetLang" });
    }

    const rawKey = process.env.ANTHROPIC_API_KEY;
    // Only treat it as a real key if it looks like one (lets the free path run with the placeholder)
    const apiKey = rawKey && rawKey.startsWith("sk-") ? rawKey : null;
    const targetLangName = targetLangNameOf(targetLang);

    if (!apiKey) {
      return res.status(200).json({ noText: true, isMock: true });
    }

    const mediaType = imageBase64.startsWith("/9j")
      ? "image/jpeg"
      : imageBase64.startsWith("iVBOR")
      ? "image/png"
      : imageBase64.startsWith("R0lGOD")
      ? "image/gif"
      : imageBase64.startsWith("UklGR")
      ? "image/webp"
      : "image/jpeg";

    const response = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: OCR_MODEL,
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: imageBase64,
                },
              },
              {
                type: "text",
                text: `Look at this image. Find ALL visible text and return their positions.

IMPORTANT: Return ONLY a valid JSON array. No markdown, no explanation, no code fences.
Limit to the 15 most important text blocks only.

Format:
[{"original":"text here","translated":"${targetLangName} translation","x":50,"y":30,"width":40,"fontSize":"medium"}]

Rules:
- x,y = center position as % of image (0-100)
- width = text block width as % of image width
- fontSize = "small", "medium", or "large"
- If NO text exists: []
- Translate to ${targetLangName}
- Keep numbers/prices/names unchanged if not translatable`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const raw = data?.content?.[0]?.text?.trim() ?? "";

    if (!raw) {
      return res.status(200).json({ noText: true });
    }

    // Try multiple parsing strategies, since models sometimes wrap JSON
    let blocks = null;

    // Strategy 1: direct parse
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) blocks = parsed;
    } catch {
      /* try next */
    }

    // Strategy 2: extract the first array with a regex
    if (!blocks) {
      const match = raw.match(/\[[\s\S]*?\]/);
      if (match) {
        try {
          blocks = JSON.parse(match[0]);
        } catch {
          /* try next */
        }
      }
    }

    // Strategy 3: find first [ and repair truncation
    if (!blocks) {
      const start = raw.indexOf("[");
      if (start !== -1) {
        let jsonStr = raw.substring(start);
        jsonStr = jsonStr.replace(/```[\s\S]*$/, "").trim();
        const lastClosing = jsonStr.lastIndexOf("}");
        if (lastClosing !== -1) {
          jsonStr = jsonStr.substring(0, lastClosing + 1) + "]";
        }
        try {
          blocks = JSON.parse(jsonStr);
        } catch {
          /* failed */
        }
      }
    }

    if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
      return res.status(200).json({ noText: true });
    }

    // Validate and clamp blocks
    const validBlocks = blocks
      .filter(
        (b) =>
          b &&
          typeof b.original === "string" &&
          typeof b.translated === "string" &&
          typeof b.x === "number" &&
          typeof b.y === "number"
      )
      .slice(0, 15)
      .map((b) => ({
        original: b.original,
        translated: b.translated,
        x: Math.max(0, Math.min(100, b.x)),
        y: Math.max(0, Math.min(100, b.y)),
        width: Math.max(5, Math.min(100, b.width ?? 30)),
        fontSize: ["small", "medium", "large"].includes(b.fontSize ?? "")
          ? b.fontSize
          : "medium",
      }));

    if (validBlocks.length === 0) {
      return res.status(200).json({ noText: true });
    }

    return res.status(200).json({ blocks: validBlocks, isMock: false });
  } catch (error) {
    console.error("An error occurred during OCR", error);
    return res.status(500).json({ message: "OCR failed" });
  }
};
