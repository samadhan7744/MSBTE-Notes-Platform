import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, FileText, IndianRupee, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SiteHeader } from "@/components/site-header";
import { getSubject, subjects } from "@/lib/data";

export function generateStaticParams() {
  return subjects.map((subject) => ({ id: subject.id }));
}

export default async function SubjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const subject = getSubject(id);

  if (!subject) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="page-shell py-8">
        <Button asChild variant="ghost" className="mb-5 px-0">
          <Link href="/subjects">
            <ArrowLeft size={18} />
            Back to subjects
          </Link>
        </Button>
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <section className="rounded-lg border bg-white p-5 shadow-soft md:p-8">
            <div className="flex flex-wrap gap-2">
              <Badge>Semester {subject.semester}</Badge>
              <Badge variant={subject.isFree ? "free" : "paid"}>{subject.isFree ? "Free" : "Paid Pack"}</Badge>
              <Badge variant="muted">Code {subject.code}</Badge>
            </div>
            <h1 className="mt-5 text-3xl font-bold leading-tight text-slate-950 md:text-5xl">{subject.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{subject.description}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["Notes", subject.notesCount],
                ["PDF Pages", subject.pages],
                ["Downloads", subject.downloads],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md border bg-slate-50 p-4">
                  <p className="text-2xl font-bold text-slate-950">{value}</p>
                  <p className="text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <div className="mb-2 flex justify-between text-sm font-semibold">
                <span>Student completion</span>
                <span>{subject.progress}%</span>
              </div>
              <Progress value={subject.progress} />
            </div>
          </section>
          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Access Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-md border bg-blue-50 p-4">
                  <span className="text-sm font-semibold text-slate-600">Price</span>
                  <span className="flex items-center text-2xl font-bold text-blue-700">
                    {subject.isFree ? "Free" : <><IndianRupee size={20} />{subject.price}</>}
                  </span>
                </div>
                <Button asChild className="w-full" size="lg">
                  <Link href={subject.isFree ? subject.pdf : `/payment?subject=${subject.id}`}>
                    {subject.isFree ? <Download size={18} /> : <IndianRupee size={18} />}
                    {subject.isFree ? "Download PDF" : "Purchase Notes"}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={subject.pdf}>
                    <FileText size={17} />
                    Preview Sample
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-3 p-5 text-sm text-slate-600">
                <p className="flex items-center gap-2 font-semibold text-slate-900">
                  <Star className="text-amber-500" size={18} />
                  {subject.rating} rating
                </p>
                <p>Includes unit-wise notes, exam-focused revision points, diagrams, and model answers.</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </>
  );
}
