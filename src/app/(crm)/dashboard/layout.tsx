import { Frame } from "./_components/Frame";
import DashboardContentWrapper from "./_components/DashboardContentWrapper";

// This layout is for the dashboard page specifically
// The right sidebar (Reports/Help Materials) is controlled by the main CRM layout
// For pages that need custom right sidebar, they would need a special wrapper
// or use CSS classes to hide the default sidebar and add their own content

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout flex h-full flex-col space-y-6 overflow-x-hidden p-4">
      <Frame />
      <DashboardContentWrapper />
      {children}
    </div>
  );
}
