import { Sun, Moon, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useThemeStore } from "@/stores/useThemeStore";
import { useState } from "react";

const PreferencesForm = () => {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useThemeStore();

  const isVietnamese = (i18n.resolvedLanguage || i18n.language) === "vi";
  const handleLanguageToggle = (checked: boolean) => {
    i18n.changeLanguage(checked ? "vi" : "en");
  };

  //   you need to handle the setOnlineStatus logic
  const [onlineStatus, setOnlineStatus] = useState(false);

  return (
    <Card className="glass-strong border-border/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-primary" />
          {t("settings.preferences")}
        </CardTitle>
        <CardDescription>{t("settings.preferencesDesc")}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div>
            <Label
              htmlFor="theme-toggle"
              className="text-base font-medium"
            >
              {t("settings.darkMode")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.darkModeDesc")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-muted-foreground" />
            <Switch
              id="theme-toggle"
              checked={isDark}
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-primary-glow"
            />
            <Moon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Online Status */}
        <div className="flex items-center justify-between">
          <div>
            <Label
              htmlFor="online-status"
              className="text-base font-medium"
            >
              {t("settings.showOnline")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.showOnlineDesc")}
            </p>
          </div>
          <Switch
            id="online-status"
            checked={onlineStatus}
            onCheckedChange={setOnlineStatus}
            className="data-[state=checked]:bg-primary-glow"
          />
        </div>

        {/* Language */}
        <div className="flex items-center justify-between">
          <div>
            <Label
              htmlFor="language-toggle"
              className="text-base font-medium flex items-center gap-2"
            >
              <Globe className="h-4 w-4 text-muted-foreground" />
              {t("settings.language")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {isVietnamese
                ? t("settings.languageVietnamese")
                : t("settings.languageEnglish")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">EN</span>
            <Switch
              id="language-toggle"
              checked={isVietnamese}
              onCheckedChange={handleLanguageToggle}
              className="data-[state=checked]:bg-primary-glow"
            />
            <span className="text-sm text-muted-foreground">VI</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesForm;
