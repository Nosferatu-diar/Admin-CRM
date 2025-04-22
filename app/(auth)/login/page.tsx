import LoginForm from "@/components/login-form";
import React from "react";

const Login = () => {
  return (
    <section className="h-screen flex flex-col gap-10 justify-center items-center">
      <h1 className="text-3xl font-bold">Admin CRM</h1>
      <div className="w-[450px]">
        <LoginForm />
      </div>
    </section>
  );
};

export default Login;
