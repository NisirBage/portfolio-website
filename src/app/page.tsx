import { PerfMonitor } from "@/components/PerfMonitor";
import { Workspace } from "@/components/workspace/Workspace";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <h1 className="sr-only">The Studio — Nisir Sanang Bage</h1>
      <PerfMonitor />
      <Workspace />
    </main>
  );
}
