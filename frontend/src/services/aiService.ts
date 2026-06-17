import api from "@/lib/axios";

export type AppLang = "en" | "vi";

export interface OcrBlock {
  original: string;
  translated: string;
  x: number;
  y: number;
  width: number;
  fontSize: "small" | "medium" | "large";
}

export interface TranslateResult {
  translatedText: string;
  isMock: boolean;
}

export interface OcrResult {
  blocks?: OcrBlock[];
  noText?: boolean;
  isMock?: boolean;
}

export const aiService = {
  async translate(text: string, targetLang: AppLang): Promise<TranslateResult> {
    const res = await api.post("/ai/translate", { text, targetLang });
    return res.data;
  },

  async ocr(imageBase64: string, targetLang: AppLang): Promise<OcrResult> {
    const res = await api.post("/ai/ocr", { imageBase64, targetLang });
    return res.data;
  },
};

// Fetch an image URL and return raw base64 (without the data URL prefix)
export const urlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const commaIndex = result.indexOf(",");
      resolve(commaIndex >= 0 ? result.substring(commaIndex + 1) : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
