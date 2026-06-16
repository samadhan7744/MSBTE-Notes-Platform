import { AuthPanel } from "@/components/auth-panel";
import { SiteHeader } from "@/components/site-header";

export default function RegisterPage() {
  return (
    <>
      <SiteHeader />
      <AuthPanel mode="register" />
    </>
  );
}
