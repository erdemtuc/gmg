import HelpMaterials from "./_components/help-materials";
import LeftMenuServer from "./_components/left-menu/left-menu-server";
import LeftMenuSkeleton from "./_components/left-menu/left-menu-skeleton";
import Reports from "./_components/reports";
import TopBar from "./_components/top-bar";
import { Suspense } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell bg-brand-gray-50 grid h-screen min-h-0 grid-cols-[var(--left-menu-w)_1fr_25rem] grid-rows-[auto_1fr] overflow-hidden transition-[grid-template-columns] duration-300 ease-in-out">
      {/* Left Menu (spans both rows) */}
      <aside className="row-span-2 min-h-0">
        <Suspense fallback={<LeftMenuSkeleton />}>
          <LeftMenuServer />
        </Suspense>
      </aside>

      {/* Top Bar */}
      <header className="col-span-2 h-14 w-full">
        <TopBar />
      </header>

      {/* Content */}
      <main className="bg-brand-gray-50 mt-6 mr-4 mb-9 ml-6 flex min-h-0 flex-col">
        {children}
      </main>

      {/* Side Pane */}
      <aside className="mt-6 mr-6 mb-9 space-y-4">
        <Reports />
        <HelpMaterials />
      </aside>
    </div>
  );
}
