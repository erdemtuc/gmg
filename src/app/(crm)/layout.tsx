import HelpMaterials from "./_components/help-materials";
import LeftMenuServer from "./_components/left-menu/left-menu-server";
import LeftMenuSkeleton from "./_components/left-menu/left-menu-skeleton";
import Reports from "./_components/reports";
import TopBar from "./_components/top-bar";
import { Suspense } from "react";

// This layout is used specifically for the CRM section with a fixed sidebar configuration
// To customize the sidebar, create a separate layout or use context/state

export default function AppShell({ 
  children
}: {
  children: React.ReactNode;
}) {
  const showDefaultSidebar = true;
  const customSidebar = undefined;
  return (
    <div className={`app-shell bg-brand-gray-50 grid h-screen min-h-0 grid-cols-[var(--left-menu-w)_1fr${showDefaultSidebar ? '_25rem' : ''}] grid-rows-[auto_1fr] overflow-hidden transition-[grid-template-columns] duration-300 ease-in-out`}>
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

      {/* Side Pane - Will be hidden if showDefaultSidebar is false, or replaced with custom sidebar */}
      {showDefaultSidebar && (
        <aside className="mt-6 mr-6 mb-9 space-y-4 reports-help-section">
          {customSidebar ? customSidebar : (
            <>
              <Reports />
              <HelpMaterials />
            </>
          )}
        </aside>
      )}
    </div>
  );
}
