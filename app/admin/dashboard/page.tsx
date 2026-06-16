import Link from "next/link";
import { BarChart3, FileUp, IndianRupee, Users } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { subjects } from "@/lib/data";

const adminStats = [
  { label: "Total Subjects", value: "10", icon: BarChart3 },
  { label: "Active Students", value: "1,248", icon: Users },
  { label: "Monthly Revenue", value: "₹42.8k", icon: IndianRupee },
  { label: "Uploads", value: "186", icon: FileUp },
];

export default function AdminDashboardPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell py-8">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">Monitor subject content, purchases, and upload activity.</p>
          </div>
          <Button asChild>
            <Link href="/admin/upload">
              <FileUp size={17} />
              Upload Notes
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {adminStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <stat.icon className="mb-4 text-blue-600" size={24} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Subject Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {subjects.map((subject) => (
              <div key={subject.id} className="grid gap-3 rounded-md border p-4 lg:grid-cols-[1fr_160px_120px] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold">{subject.title}</h2>
                    <Badge variant={subject.isFree ? "free" : "paid"}>{subject.isFree ? "Free" : "Paid"}</Badge>
                    <Badge variant="muted">Sem {subject.semester}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">Code {subject.code} • {subject.notesCount} uploaded notes</p>
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-xs font-semibold">
                    <span>Quality</span>
                    <span>{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} />
                </div>
                <Button asChild variant="outline">
                  <Link href={`/subjects/${subject.id}`}>Preview</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
