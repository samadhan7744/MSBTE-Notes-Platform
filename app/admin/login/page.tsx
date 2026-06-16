import { AuthPanel } from "@/components/auth-panel";
import { SiteHeader } from "@/components/site-header";

export default function AdminLoginPage() {
  return (
    <>
      <SiteHeader />
      <AuthPanel mode="login" admin />
    </>
  );
}
