import { Suspense } from "react";
import LoginForm from "./login-form";

export default async function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-background px-4 py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
