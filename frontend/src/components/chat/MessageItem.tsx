import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import UserAvatar from "./UserAvatar";
import OcrImage from "./OcrImage";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Languages, Loader2 } from "lucide-react";
import { aiService } from "@/services/aiService";
import { toast } from "sonner";

interface MessageItemProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConvo: Conversation;
  lastMessageStatus: "delivered" | "seen";
}

const MessageItem = ({
  message,
  index,
  messages,
  selectedConvo,
  lastMessageStatus,
}: MessageItemProps) => {
  const { t, i18n } = useTranslation();
  const [translated, setTranslated] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translateLoading, setTranslateLoading] = useState(false);

  const prev = index + 1 < messages.length ? messages[index + 1] : undefined;

  const isShowTime =
    index === 0 ||
    new Date(message.createdAt).getTime() -
      new Date(prev?.createdAt || 0).getTime() >
      300000; // 5 minutes

  const isGroupBreak = isShowTime || message.senderId !== prev?.senderId;

  const participant = selectedConvo.participants.find(
    (p: Participant) => p._id.toString() === message.senderId.toString()
  );

  const handleTranslate = async () => {
    if (!message.content) return;

    // Already translated: just toggle between original and translation
    if (translated) {
      setShowTranslation((s) => !s);
      return;
    }

    setTranslateLoading(true);
    try {
      const targetLang =
        (i18n.resolvedLanguage || i18n.language) === "vi" ? "vi" : "en";
      const result = await aiService.translate(message.content, targetLang);
      setTranslated(result.translatedText);
      setShowTranslation(true);
    } catch (error) {
      console.error("Translation failed", error);
      toast.error(t("ai.translateError"));
    } finally {
      setTranslateLoading(false);
    }
  };

  const translateLabel = translateLoading
    ? t("ai.translating")
    : showTranslation
    ? t("ai.showOriginal")
    : t("ai.translate");

  return (
    <>
      {/* time */}
      {isShowTime && (
        <span className="flex justify-center text-xs text-muted-foreground px-1">
          {formatMessageTime(new Date(message.createdAt))}
        </span>
      )}

      <div
        className={cn(
          "flex gap-2 message-bounce mt-1",
          message.isOwn ? "justify-end" : "justify-start"
        )}
      >
        {/* avatar */}
        {!message.isOwn && (
          <div className="w-8">
            {isGroupBreak && (
              <UserAvatar
                type="chat"
                name={participant?.displayName ?? "Xin Chào"}
                avatarUrl={participant?.avatarUrl ?? undefined}
              />
            )}
          </div>
        )}

        {/* message */}
        <div
          className={cn(
            "max-w-xs lg:max-w-md space-y-1 flex flex-col",
            message.isOwn ? "items-end" : "items-start"
          )}
        >
          <Card
            className={cn(
              "p-3 space-y-2",
              message.isOwn ? "chat-bubble-sent border-0" : "chat-bubble-received"
            )}
          >
            {message.imgUrl && <OcrImage imgUrl={message.imgUrl} />}

            {message.content && (
              <>
                <p className="text-sm leading-relaxed break-words">
                  {message.content}
                </p>
                {showTranslation && translated && (
                  <p className="text-sm leading-relaxed break-words mt-1 pt-1 border-t border-white/20 opacity-90 italic">
                    {translated}
                  </p>
                )}
              </>
            )}
          </Card>

          {/* translate toggle (text messages only) */}
          {message.content && (
            <button
              type="button"
              onClick={handleTranslate}
              disabled={translateLoading}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-smooth"
            >
              {translateLoading ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Languages className="size-3" />
              )}
              {translateLabel}
            </button>
          )}

          {/* seen/ delivered */}
          {message.isOwn && message._id === selectedConvo.lastMessage?._id && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs px-1.5 py-0.5 h-4 border-0",
                lastMessageStatus === "seen"
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {lastMessageStatus}
            </Badge>
          )}
        </div>
      </div>
    </>
  );
};

export default MessageItem;
