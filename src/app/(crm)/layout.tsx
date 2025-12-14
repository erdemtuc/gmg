'use client';

import HelpMaterials from "./_components/help-materials";
import LeftMenuClientWrapper from "./_components/left-menu/left-menu-client-wrapper";
import LeftMenuSkeleton from "./_components/left-menu/left-menu-skeleton";
import Reports from "./_components/reports";
import TopBar from "./_components/top-bar";
import ClientAppShell from "./_components/ClientAppShell";
import { Suspense } from "react";
import { usePathname } from 'next/navigation';
import { useSelectedLayoutSegment } from 'next/navigation';

// Client wrapper component that has access to router
function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  'use client';

  const pathname = usePathname();
  const segment = useSelectedLayoutSegment();

  // Check if this is the calendar page by checking for a specific class on the child
  const isCalendarPage = typeof children === 'object' && children !== null &&
    (children as { props?: { className?: string } }).props?.className?.includes('calendar-page');

  // Check if this is the dashboard page
  const isDashboardPage = pathname === '/dashboard' || pathname.startsWith('/dashboard/');

  return (
    <div className="bg-brand-gray-50 min-h-screen w-full flex">
      {/* Left Menu */}
      <aside className="bg-brand-primary-600 min-h-screen w-60 flex-shrink-0">
        <Suspense fallback={<LeftMenuSkeleton />}>
          <LeftMenuClientWrapper />
        </Suspense>
      </aside>

      {/* Main Content Area with Top Bar and Page Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-14 w-full border-b border-gray-200 bg-white flex items-center px-6">
          <TopBar />
        </header>

        {/* Content and Side Pane container */}
        <div className="flex flex-1 overflow-hidden">
          {/* Page Content */}
          <main className="bg-brand-gray-50 mt-6 mr-4 mb-9 ml-6 flex min-h-0 flex-1 flex-col overflow-y-auto">
            <ClientAppShell>
              {children}
            </ClientAppShell>
          </main>

          {/* Side Pane - Show different content based on page */}
          {!isCalendarPage && (
            <aside className="mt-6 mr-6 mb-9 space-y-4 w-96 flex-shrink-0">
              {isDashboardPage ? (
                <>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Agenda</h4>
                    <p className="text-xs text-gray-600">Upcoming tasks and events</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Help Materials</h4>
                    <p className="text-xs text-gray-600">Resources and documentation</p>
                  </div>
                </>
              ) : (
                <>
                  <Reports />
                  <HelpMaterials />
                </>
              )}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ClientLayoutWrapper>
      {children}
    </ClientLayoutWrapper>
  );
}