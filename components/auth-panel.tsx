import Link from "next/link";
import { BookOpenCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AuthPanel({
  mode,
  admin = false,
}: {
  mode: "login" | "register";
  admin?: boolean;
}) {
  const isRegister = mode === "register";
  return (
    <main className="page-shell grid min-h-[calc(100vh-64px)] items-center py-10 lg:grid-cols-[1fr_440px] lg:gap-10">
      <section className="hidden lg:block">
        <div className="max-w-xl">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-blue-600 text-white">
            <BookOpenCheck />
          </div>
          <h1 className="text-4xl font-bold leading-tight text-slate-950">
            {admin ? "Secure admin access for notes operations." : "MSBTE notes built for faster semester preparation."}
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Manage Computer Engineering notes, purchases, downloads, and academic progress from a clean mobile-first platform.
          </p>
        </div>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>{admin ? "Admin Login" : isRegister ? "Create Student Account" : "Student Login"}</CardTitle>
          <CardDescription>
            {admin ? "Access upload, revenue, and subject management tools." : "Use demo credentials or fill sample details for presentation."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isRegister && <Input placeholder="Full name" />}
          <Input placeholder={admin ? "admin@msbte.local" : "student@msbte.local"} type="email" />
          {isRegister && <Input placeholder="Enrollment number" />}
          <Input placeholder="Password" type="password" />
          <Button className="w-full">{admin ? "Open Admin Dashboard" : isRegister ? "Register" : "Login"}</Button>
          {!admin && (
            <p className="text-center text-sm text-slate-600">
              {isRegister ? "Already registered?" : "New student?"}{" "}
              <Link href={isRegister ? "/login" : "/register"} className="font-semibold text-blue-700">
                {isRegister ? "Login" : "Create account"}
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
