import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const Logout = () => {
  const { t } = useTranslation();
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      variant="completeGhost"
      onClick={handleLogout}
    >
      <LogOut className="text-destructive" />
      {t("auth.logout")}
    </Button>
  );
};

export default Logout;
