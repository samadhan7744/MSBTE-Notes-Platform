"use client";

import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { SubjectCard } from "@/components/subject-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { semesters, subjects } from "@/lib/data";

export function SubjectsClient() {
  const [query, setQuery] = useState("");
  const [semester, setSemester] = useState<number | "all">("all");

  const filtered = useMemo(() => {
    return subjects.filter((subject) => {
      const matchesQuery =
        subject.title.toLowerCase().includes(query.toLowerCase()) ||
        subject.code.includes(query) ||
        subject.description.toLowerCase().includes(query.toLowerCase());
      const matchesSemester = semester === "all" || subject.semester === semester;
      return matchesQuery && matchesSemester;
    });
  }, [query, semester]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-lg border bg-white p-4 shadow-soft md:grid-cols-[1fr_auto]">
        <label className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search subject, code, or topic"
            className="pl-10"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <Filter size={18} className="text-blue-600" />
          <Button variant={semester === "all" ? "default" : "outline"} size="sm" onClick={() => setSemester("all")}>
            All
          </Button>
          {semesters.map((sem) => (
            <Button
              key={sem}
              variant={semester === sem ? "default" : "outline"}
              size="sm"
              onClick={() => setSemester(sem)}
            >
              Sem {sem}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-600">{filtered.length} subjects found</p>
        <Badge variant="muted">Computer Engineering</Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
}
