import Link from "next/link";
import { ArrowLeft, FilePlus2, UploadCloud } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function UploadNotesPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell py-8">
        <Button asChild variant="ghost" className="mb-5 px-0">
          <Link href="/admin/dashboard">
            <ArrowLeft size={18} />
            Back to admin
          </Link>
        </Button>
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader>
              <CardTitle>Upload Notes</CardTitle>
              <CardDescription>Add semester-wise PDFs for Computer Engineering subjects.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Input placeholder="Subject title" />
              <Input placeholder="Subject code" />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Semester" />
                <Input placeholder="Price or Free" />
              </div>
              <textarea
                className="min-h-28 rounded-md border bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Short note description"
              />
              <label className="grid min-h-44 cursor-pointer place-items-center rounded-lg border border-dashed bg-blue-50 text-center">
                <div>
                  <UploadCloud className="mx-auto mb-3 text-blue-600" size={34} />
                  <p className="font-semibold">Drop PDF file here</p>
                  <p className="mt-1 text-sm text-slate-500">PDF, up to 25 MB</p>
                </div>
                <input className="sr-only" type="file" accept="application/pdf" />
              </label>
              <Button size="lg">
                <FilePlus2 size={18} />
                Publish Notes
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upload Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              {["Match MSBTE syllabus", "Include unit labels", "Add free or paid badge", "Attach readable PDF", "Verify subject preview"].map((item) => (
                <div key={item} className="rounded-md border bg-slate-50 p-3 font-semibold text-slate-700">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
