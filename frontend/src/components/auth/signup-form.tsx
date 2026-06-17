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

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const { signUp } = useAuthStore();
  const navigate = useNavigate();

  const signUpSchema = z.object({
    firstname: z.string().min(1, t("auth.errors.firstnameRequired")),
    lastname: z.string().min(1, t("auth.errors.lastnameRequired")),
    username: z.string().min(3, t("auth.errors.usernameMin")),
    email: z.email(t("auth.errors.emailInvalid")),
    password: z.string().min(6, t("auth.errors.passwordMin")),
  });

  type SignUpFormValues = z.infer<typeof signUpSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    const { firstname, lastname, username, email, password } = data;

    // call backend to sign up
    await signUp(username, password, email, firstname, lastname);

    navigate("/signin");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* header - logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="logo" />
                </a>

                <h1 className="text-2xl font-bold">{t("auth.signup.title")}</h1>
                <p className="text-muted-foreground text-balance">
                  {t("auth.signup.subtitle")}
                </p>
              </div>

              {/* first & last name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="block text-sm">
                    {t("auth.fields.firstname")}
                  </Label>
                  <Input
                    type="text"
                    id="firstname"
                    {...register("firstname")}
                  />
                  {errors.firstname && (
                    <p className="error-message">{errors.firstname.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="block text-sm">
                    {t("auth.fields.lastname")}
                  </Label>
                  <Input type="text" id="lastname" {...register("lastname")} />
                  {errors.lastname && (
                    <p className="error-message">{errors.lastname.message}</p>
                  )}
                </div>
              </div>

              {/* username */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="username" className="block text-sm">
                  {t("auth.fields.username")}
                </Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="xinchao"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="error-message">{errors.username.message}</p>
                )}
              </div>

              {/* email */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="email" className="block text-sm">
                  {t("auth.fields.email")}
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="m@gmail.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="error-message">{errors.email.message}</p>
                )}
              </div>

              {/* password */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="password" className="block text-sm">
                  {t("auth.fields.password")}
                </Label>
                <Input
                  type="password"
                  id="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="error-message">{errors.password.message}</p>
                )}
              </div>

              {/* sign up button */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {t("auth.signup.submit")}
              </Button>

              <div className="text-center text-sm">
                {t("auth.signup.haveAccount")}{" "}
                <a href="/signin" className="underline underline-offset-4">
                  {t("auth.signup.signinLink")}
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholderSignUp.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className=" text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offetset-4">
        {t("auth.terms.prefix")}
        <a href="#">{t("auth.terms.tos")}</a>
        {t("auth.terms.and")}
        <a href="#">{t("auth.terms.privacy")}</a>
        {t("auth.terms.suffix")}
      </div>
    </div>
  );
}
