import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export function SigninForm({ className, ...props }: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const { signIn } = useAuthStore();
  const navigate = useNavigate();

  const signInSchema = z.object({
    username: z.string().min(3, t("auth.errors.usernameMin")),
    password: z.string().min(6, t("auth.errors.passwordMin")),
  });

  type SignInFormValues = z.infer<typeof signInSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    const { username, password } = data;
    await signIn(username, password);
    navigate("/");
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-6">
              {/* header - logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <a
                  href="/"
                  className="mx-auto block w-fit text-center"
                >
                  <img
                    src="/logo.svg"
                    alt="logo"
                  />
                </a>

                <h1 className="text-2xl font-bold">{t("auth.signin.title")}</h1>
                <p className="text-muted-foreground text-balance">
                  {t("auth.signin.subtitle")}
                </p>
              </div>

              {/* username */}
              <div className="flex flex-col gap-3">
                <Label
                  htmlFor="username"
                  className="block text-sm"
                >
                  {t("auth.fields.username")}
                </Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="xinchao"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-destructive text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* password */}
              <div className="flex flex-col gap-3">
                <Label
                  htmlFor="password"
                  className="block text-sm"
                >
                  {t("auth.fields.password")}
                </Label>
                <Input
                  type="password"
                  id="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-destructive text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* sign in button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {t("auth.signin.submit")}
              </Button>

              <div className="text-center text-sm">
                {t("auth.signin.noAccount")}{" "}
                <a
                  href="/signup"
                  className="underline underline-offset-4"
                >
                  {t("auth.signin.signupLink")}
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className=" text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offetset-4">
        {t("auth.terms.prefix")}<a href="#">{t("auth.terms.tos")}</a>{t("auth.terms.and")}
        <a href="#">{t("auth.terms.privacy")}</a>{t("auth.terms.suffix")}
      </div>
    </div>
  );
}
