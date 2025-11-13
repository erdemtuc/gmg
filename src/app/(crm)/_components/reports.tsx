import TasksAppOutlinedIcon from "@/icons/tasks-app-outlined-icon.svg";
import ChevronOutlinedUpIcon from "@/icons/chevron-outlined-up-icon.svg";

type ReportItem = {
  id: string;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  records: number;
};

const reports: ReportItem[] = [
  {
    id: "individuals",
    label: "Individuals",
    Icon: TasksAppOutlinedIcon,
    records: 82,
  },
  {
    id: "companies",
    label: "Companies",
    Icon: TasksAppOutlinedIcon,
    records: 100,
  },
  {
    id: "prospects",
    label: "Prospect List",
    Icon: TasksAppOutlinedIcon,
    records: 100,
  },
  {
    id: "leads",
    label: "Lead List",
    Icon: TasksAppOutlinedIcon,
    records: 100,
  },
];

export default function Reports() {
  return (
    <div className="bg-brand-white rounded-lg px-4 pt-4 pb-2">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-brand-gray-600 text-base font-medium">Reports</h2>
        <button className="no-background">
          <span className="text-brand-primary-500 hover:bg-brand-gray-100 cursor-pointer rounded p-1 text-xs font-medium">
            New Report
          </span>
        </button>
      </div>
      <div className="divide-brand-gray-200 divide-y">
        {reports.map((item) => (
          <div
            key={item.id}
            className="hover:bg-brand-gray-100 flex cursor-pointer items-start justify-between rounded px-1 py-2"
          >
            <div className="flex items-center gap-2">
              <item.Icon className="text-brand-primary-600 size-4" />
              <div className="flex flex-col">
                <span className="text-brand-gray-600 text-sm font-normal">
                  {item.label}
                </span>
                <span className="text-brand-gray-400 text-xs font-normal">
                  {item.records} records
                </span>
              </div>
            </div>
            <ChevronOutlinedUpIcon className="text-brand-gray-300 size-4 rotate-90 self-center" />
          </div>
        ))}
      </div>
    </div>
  );
}
