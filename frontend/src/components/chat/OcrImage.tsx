import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Loader2, Languages } from "lucide-react";
import { aiService, urlToBase64, type OcrBlock } from "@/services/aiService";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const fontSizeClass = (size: OcrBlock["fontSize"]) =>
  size === "small" ? "text-[8px]" : size === "large" ? "text-sm" : "text-[10px]";

const OcrImage = ({ imgUrl }: { imgUrl: string }) => {
  const { t, i18n } = useTranslation();
  const [blocks, setBlocks] = useState<OcrBlock[] | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(false);

  const targetLang =
    (i18n.resolvedLanguage || i18n.language) === "vi" ? "vi" : "en";

  const handleOcr = async () => {
    // Already scanned: just toggle the overlay
    if (blocks) {
      setShowOverlay((s) => !s);
      return;
    }

    setLoading(true);
    try {
      const base64 = await urlToBase64(imgUrl);
      const result = await aiService.ocr(base64, targetLang);

      if (result.noText || !result.blocks || result.blocks.length === 0) {
        toast.info(t("ai.ocrNoText"));
        return;
      }

      setBlocks(result.blocks);
      setShowOverlay(true);
    } catch (error) {
      console.error("OCR failed", error);
      toast.error(t("ai.ocrError"));
    } finally {
      setLoading(false);
    }
  };

  const label = loading
    ? t("ai.ocrScanning")
    : blocks && showOverlay
    ? t("ai.ocrHide")
    : t("ai.ocrTranslate");

  return (
    <div className="space-y-1">
      <div className="relative inline-block">
        <img
          src={imgUrl}
          alt=""
          className="rounded-lg max-w-full max-h-72 object-cover"
        />
        {showOverlay && blocks && (
          <div className="absolute inset-0 pointer-events-none">
            {blocks.map((b, i) => (
              <span
                key={i}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 bg-black/75 text-white px-1 py-0.5 rounded text-center leading-tight",
                  fontSizeClass(b.fontSize)
                )}
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  width: `${b.width}%`,
                }}
              >
                {b.translated}
              </span>
            ))}
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleOcr}
        disabled={loading}
        className="h-6 px-2 text-xs text-muted-foreground hover:text-primary"
      >
        {loading ? (
          <Loader2 className="size-3 mr-1 animate-spin" />
        ) : (
          <Languages className="size-3 mr-1" />
        )}
        {label}
      </Button>
    </div>
  );
};

export default OcrImage;
