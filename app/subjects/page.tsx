import { SiteHeader } from "@/components/site-header";
import { SubjectsClient } from "@/app/subjects/subjects-client";

export default function SubjectsPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell py-8">
        <div className="mb-7">
          <h1 className="text-3xl font-bold text-slate-950">Subjects</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Filter Computer Engineering notes by semester, search topics, and preview free or paid PDF packs.
          </p>
        </div>
        <SubjectsClient />
      </main>
    </>
  );
}
