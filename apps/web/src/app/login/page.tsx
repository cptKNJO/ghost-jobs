import { Suspense } from "react";
import LoginForm from "./login-form";

export default async function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-12 gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Login</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
