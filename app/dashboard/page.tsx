import Link from "next/link";
import { BookMarked, CalendarCheck, Download, TrendingUp } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { dashboardStats, subjects } from "@/lib/data";

const icons = [BookMarked, Download, TrendingUp, CalendarCheck];

export default function DashboardPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell py-8">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">Student Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">Track purchases, downloads, and semester study progress.</p>
          </div>
          <Button asChild>
            <Link href="/subjects">Continue Studying</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {dashboardStats.map((stat, index) => {
            const Icon = icons[index];
            return (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <Icon className="mb-4 text-blue-600" size={24} />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm font-semibold text-slate-700">{stat.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{stat.helper}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader>
              <CardTitle>My Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {subjects.slice(0, 6).map((subject) => (
                <div key={subject.id} className="grid gap-3 rounded-md border p-4 md:grid-cols-[1fr_170px] md:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold">{subject.title}</h2>
                      <Badge variant={subject.isFree ? "free" : "paid"}>{subject.isFree ? "Free" : "Purchased"}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">Semester {subject.semester} • Code {subject.code}</p>
                    <div className="mt-3">
                      <Progress value={subject.progress} />
                    </div>
                  </div>
                  <Button asChild variant="outline">
                    <Link href={subject.pdf}>
                      <Download size={16} />
                      Download
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Semester Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((sem) => {
                const value = 45 + sem * 7;
                return (
                  <div key={sem}>
                    <div className="mb-2 flex justify-between text-sm font-semibold">
                      <span>Semester {sem}</span>
                      <span>{value}%</span>
                    </div>
                    <Progress value={value} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
