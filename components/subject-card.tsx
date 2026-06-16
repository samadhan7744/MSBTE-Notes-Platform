import Link from "next/link";
import { Download, Eye, IndianRupee, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Subject } from "@/lib/data";

export function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="mb-2 flex items-start justify-between gap-3">
          <Badge variant="default">Sem {subject.semester}</Badge>
          <Badge variant={subject.isFree ? "free" : "paid"}>{subject.isFree ? "Free" : "Paid"}</Badge>
        </div>
        <CardTitle>{subject.title}</CardTitle>
        <CardDescription>
          Code {subject.code} • {subject.notesCount} notes • {subject.pages} pages
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="line-clamp-3 text-sm leading-6 text-slate-600">{subject.description}</p>
        <div>
          <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500">
            <span>Study progress</span>
            <span>{subject.progress}%</span>
          </div>
          <Progress value={subject.progress} />
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
          <span className="flex items-center gap-1">
            <Download size={14} />
            {subject.downloads}
          </span>
          <span className="flex items-center gap-1">
            <Star size={14} />
            {subject.rating}
          </span>
          <span className="flex items-center justify-end gap-1 font-bold text-slate-900">
            {subject.isFree ? "Free" : <><IndianRupee size={13} />{subject.price}</>}
          </span>
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2">
          <Button asChild variant="outline">
            <Link href={`/subjects/${subject.id}`}>
              <Eye size={16} />
              View
            </Link>
          </Button>
          <Button asChild>
            <Link href={subject.isFree ? subject.pdf : `/payment?subject=${subject.id}`}>
              {subject.isFree ? <Download size={16} /> : <IndianRupee size={16} />}
              {subject.isFree ? "Download" : "Buy"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
