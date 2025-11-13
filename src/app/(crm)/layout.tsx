import HelpMaterials from "./_components/help-materials";
import LeftMenuServer from "./_components/left-menu/left-menu-server";
import LeftMenuSkeleton from "./_components/left-menu/left-menu-skeleton";
import Reports from "./_components/reports";
import TopBar from "./_components/top-bar";
import ClientAppShell from "./_components/ClientAppShell";
import { Suspense } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  // Check if this is the calendar page by checking for a specific class on the child
  const isCalendarPage = typeof children === 'object' && children !== null && 
    (children as { props?: { className?: string } }).props?.className?.includes('calendar-page');

  return (
    <div className={`app-shell bg-brand-gray-50 grid h-screen min-h-0 grid-cols-[var(--left-menu-w)_1fr${isCalendarPage ? '_0' : '_25rem'}] grid-rows-[auto_1fr] overflow-hidden transition-[grid-template-columns] duration-300 ease-in-out`}>
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
        <ClientAppShell>
          {children}
        </ClientAppShell>
      </main>

      {/* Side Pane - Only show if not calendar page */}
      {!isCalendarPage && (
        <aside className="mt-6 mr-6 mb-9 space-y-4">
          <Reports />
          <HelpMaterials />
        </aside>
      )}
    </div>
  ); 
}