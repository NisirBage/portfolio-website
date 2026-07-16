import { Suspense } from "react";
import { PerfMonitor } from "@/components/PerfMonitor";
import { AppShell } from "@/components/AppShell";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <h1 className="sr-only">The Studio — Nisir Sanang Bage</h1>
      <PerfMonitor />
      {/* AppShell mounts Workspace, which reads the URL (useSearchParams,
          via useLayerStack) — Next.js requires a Suspense boundary around
          any client component that does, so a deep link to ?panel=...
          doesn't force the whole route into fully dynamic rendering. */}
      <Suspense fallback={null}>
        <AppShell />
      </Suspense>
    </main>
  );
}
