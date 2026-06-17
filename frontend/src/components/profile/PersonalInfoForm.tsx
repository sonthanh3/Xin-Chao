import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";

type EditableField = {
  key: keyof Pick<User, "displayName" | "username" | "email" | "phone">;
  label: string;
  type?: string;
};

const PERSONAL_FIELDS: EditableField[] = [
  { key: "displayName", label: "profile.displayName" },
  { key: "username", label: "profile.username" },
  { key: "email", label: "profile.email", type: "email" },
  { key: "phone", label: "profile.phone" },
];

type Props = {
  userInfo: User | null;
};

const PersonalInfoForm = ({ userInfo }: Props) => {
  const { t } = useTranslation();
  if (!userInfo) return null;

  return (
    <Card className="glass-strong border-border/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="size-5 text-primary" />
          {t("profile.personalInfo")}
        </CardTitle>
        <CardDescription>
          {t("profile.personalInfoDesc")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PERSONAL_FIELDS.map(({ key, label, type }) => (
            <div
              key={key}
              className="space-y-2"
            >
              <Label htmlFor={key}>{t(label)}</Label>
              <Input
                id={key}
                type={type ?? "text"}
                value={userInfo[key] ?? ""}
                onChange={() => {}}
                className="glass-light border-border/30"
              />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">{t("profile.bio")}</Label>
          <Textarea
            id="bio"
            rows={3}
            value={userInfo.bio ?? ""}
            onChange={() => {}}
            className="glass-light border-border/30 resize-none"
          />
        </div>

        <Button className="w-full md:w-auto bg-gradient-primary hover:opacity-90 transition-opacity">
          {t("profile.saveChanges")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
