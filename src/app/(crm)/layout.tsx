'use client';

import HelpMaterials from "./_components/help-materials";
import LeftMenuClientWrapper from "./_components/left-menu/left-menu-client-wrapper";
import LeftMenuSkeleton from "./_components/left-menu/left-menu-skeleton";
import Reports from "./_components/reports";
import TopBar from "./_components/top-bar";
import ClientAppShell from "./_components/ClientAppShell";
import { Agenda } from "./dashboard/_components/sidebar/Agenda";
import { HelpMaterials as DashboardHelpMaterials } from "./dashboard/_components/sidebar/HelpMaterials";
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
      {/* Left Menu - 20% of viewport */}
      <aside className="bg-brand-primary-600 min-h-screen w-[20vw] flex-shrink-0">
        <Suspense fallback={<LeftMenuSkeleton />}>
          <LeftMenuClientWrapper />
        </Suspense>
      </aside>

      {/* Main Content Area with Top Bar and Page Content - 80% of viewport */}
      <div className="flex flex-col flex-[4]"> {/* flex-[4] takes 80% of remaining space (4 out of 5) */}
        {/* Top Bar */}
        <header className="h-14 w-full border-b border-gray-200 bg-white flex items-center px-6">
          <TopBar />
        </header>

        {/* Content and Side Pane container - Using flexbox to achieve 60%-20% split of the 80% */}
        <div className="flex flex-1 overflow-hidden">
          {/* Page Content - 60% of total viewport (3/4 of the 80%) */}
          <main className="bg-brand-gray-50 mt-6 mr-4 mb-9 ml-6 flex-[3] min-h-0 flex-1 overflow-y-auto"> {/* flex-[3] represents 3/4 of the 80% = 60% of total */}
            <ClientAppShell>
              {children}
            </ClientAppShell>
          </main>

          {/* Side Pane - Show different content based on page - 20% of total viewport (1/4 of the 80%) */}
          {!isCalendarPage && (
            <aside className="mt-6 mr-6 mb-9 space-y-4 flex-[1] min-w-0 flex-shrink-0"> {/* flex-[1] represents 1/4 of the 80% = 20% of total */}
              {isDashboardPage ? (
                <>
                  <Agenda />
                  <DashboardHelpMaterials />
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