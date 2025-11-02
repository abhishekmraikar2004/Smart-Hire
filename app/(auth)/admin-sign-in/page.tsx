import AuthForm from "@/components/AuthForm";

export default function AdminSignIn() {
  return (
    <div className="flex-center min-h-screen w-full">
      <AuthForm type="admin-sign-in" />
    </div>
  );
}
