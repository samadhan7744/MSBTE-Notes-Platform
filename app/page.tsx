import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, FileText, Search, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SubjectCard } from "@/components/subject-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { subjects } from "@/lib/data";

const highlights = [
  { label: "10 Subjects", icon: BookOpen },
  { label: "Semester 1-6", icon: CheckCircle2 },
  { label: "Sample PDFs", icon: FileText },
  { label: "Secure Admin", icon: ShieldCheck },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b bg-white">
          <div className="page-shell grid gap-8 py-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-16">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                Computer Engineering • MSBTE
              </div>
              <h1 className="text-4xl font-bold leading-tight text-slate-950 md:text-6xl">
                Study notes, paid packs, and progress in one clean platform.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                A mobile-first education frontend for browsing semester-wise notes, downloading free PDFs, purchasing premium packs, and managing uploads from admin.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/subjects">
                    Browse Subjects
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/dashboard">Student Dashboard</Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 rounded-md border bg-slate-50 px-3 py-3 text-slate-500">
                    <Search size={18} />
                    Search Java, OS, Web Development...
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {highlights.map((item) => (
                      <div key={item.label} className="rounded-md border bg-white p-4">
                        <item.icon className="mb-3 text-blue-600" size={22} />
                        <p className="text-sm font-bold">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="page-shell py-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Popular Notes</h2>
              <p className="mt-1 text-sm text-slate-600">Presentation-ready cards using dummy MSBTE data.</p>
            </div>
            <Button asChild variant="ghost">
              <Link href="/subjects">View all</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {subjects.slice(0, 3).map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
