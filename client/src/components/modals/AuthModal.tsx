import { useState } from "react";
import LoginForm from "../LoginForm";
import RegisterForm from "../RegisterForm";
import ForgotPasswordForm from "../ForgotPasswordForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const AuthModal = () => {
  const [view, setView] = useState<"login" | "register" | "forgot-password">(
    "login",
  );

  return (
    <>
      {view === "forgot-password" ? (
        <ForgotPasswordForm onBackToLogin={() => setView("login")} />
      ) : (
        <Tabs
          value={view}
          onValueChange={(v) => setView(v as "login" | "register")}
          className="w-full"
        >
          <TabsList className="w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm onForgotPassword={() => setView("forgot-password")} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      )}
    </>
  );
};

export default AuthModal;
