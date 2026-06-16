import Link from "next/link";
import { CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSubject, subjects } from "@/lib/data";

export default async function PaymentPage({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  const { subject: subjectId } = await searchParams;
  const subject = getSubject(subjectId ?? "") ?? subjects.find((item) => !item.isFree) ?? subjects[0];

  return (
    <>
      <SiteHeader />
      <main className="page-shell grid gap-5 py-8 lg:grid-cols-[1fr_380px]">
        <section>
          <h1 className="text-3xl font-bold text-slate-950">Payment</h1>
          <p className="mt-2 text-sm text-slate-600">Demo checkout for purchasing premium MSBTE notes.</p>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="text-blue-600" />
                Card Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Input placeholder="Name on card" />
              <Input placeholder="4242 4242 4242 4242" />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="MM / YY" />
                <Input placeholder="CVV" />
              </div>
              <Button size="lg">
                <LockKeyhole size={18} />
                Pay Securely
              </Button>
            </CardContent>
          </Card>
        </section>
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border bg-slate-50 p-4">
                <Badge variant="paid">Premium Pack</Badge>
                <h2 className="mt-3 font-bold">{subject.title}</h2>
                <p className="mt-1 text-sm text-slate-500">Semester {subject.semester} • {subject.pages} pages</p>
              </div>
              <div className="flex justify-between text-sm">
                <span>Notes price</span>
                <strong>₹{subject.price}</strong>
              </div>
              <div className="flex justify-between border-t pt-3 text-lg font-bold">
                <span>Total</span>
                <span>₹{subject.price}</span>
              </div>
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={16} className="text-emerald-600" />
                Demo payment screen. No real transaction is processed.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/subjects/${subject.id}`}>Back to subject</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </main>
    </>
  );
}
