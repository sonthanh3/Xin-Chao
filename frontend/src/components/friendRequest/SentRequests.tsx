import { useFriendStore } from "@/stores/useFriendStore";
import { useTranslation } from "react-i18next";
import FriendRequestItem from "./FriendRequestItem";

const SentRequests = () => {
  const { t } = useTranslation();
  const { sentList } = useFriendStore();

  if (!sentList || sentList.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("friends.noSent")}
      </p>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      <>
        {sentList.map((req) => (
          <FriendRequestItem
            key={req._id}
            requestInfo={req}
            type="sent"
            actions={
              <p className="text-muted-foreground text-sm">{t("friends.awaitingResponse")}</p>
            }
          />
        ))}
      </>
    </div>
  );
};

export default SentRequests;
