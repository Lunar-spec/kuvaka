import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <LoginForm />
    </div>
  );
};

export default Login;
