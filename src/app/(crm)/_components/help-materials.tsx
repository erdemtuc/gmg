import { StaticMenuItem } from "@/core/contracts/navigation";
import QuestionOutlinedCircleIcon from "@/icons/question-outlined-circle-icon.svg";

const helpMenu: StaticMenuItem[] = [
  {
    id: "support",
    label: "Support",
    href: "/support",
    IconOutlined: QuestionOutlinedCircleIcon,
    IconFilled: QuestionOutlinedCircleIcon,
  },
  {
    id: "security",
    label: "Security & Terms of Service",
    href: "/security",
    IconOutlined: QuestionOutlinedCircleIcon,
    IconFilled: QuestionOutlinedCircleIcon,
  },
  {
    id: "pricing",
    label: "Pricing & Features",
    href: "/pricing",
    IconOutlined: QuestionOutlinedCircleIcon,
    IconFilled: QuestionOutlinedCircleIcon,
  },
  {
    id: "faq",
    label: "FAQ",
    href: "/faq",
    IconOutlined: QuestionOutlinedCircleIcon,
    IconFilled: QuestionOutlinedCircleIcon,
  },
  {
    id: "tutorial",
    label: "Tutorial",
    href: "/tutorial",
    IconOutlined: QuestionOutlinedCircleIcon,
    IconFilled: QuestionOutlinedCircleIcon,
  },
];

export default function HelpMaterials() {
  return (
    <div className="bg-brand-white rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-brand-gray-600 text-base font-medium">
          Help Materials
        </h2>
        <button className="no-background">
          <span className="text-brand-primary-500 hover:bg-brand-gray-100 cursor-pointer rounded p-1 text-xs font-medium">
            Hide
          </span>
        </button>
      </div>
      <div className="space-y-1">
        {helpMenu.map((item) => (
          <div
            key={item.id}
            className="hover:bg-brand-gray-100 flex cursor-pointer items-center gap-2 rounded p-1"
          >
            <item.IconOutlined className="text-brand-primary-600 size-4" />
            <span className="text-brand-gray-600 text-sm font-normal">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
