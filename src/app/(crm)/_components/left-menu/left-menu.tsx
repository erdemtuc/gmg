"use client";

// import { ReactComponent as ArrowMinimizeOutlinedVerticalIcon } from "@/icons/arrow-minimize-outlined-vertical-icon.svg";
// import { ReactComponent as ArrowMaximizeOutlinedVerticalIcon } from "@/icons/arrow-maximize-outlined-vertical-icon.svg";
// import { ReactComponent as ContactCardFilledDefaultIcon } from "@/icons/contact-card-filled-default-icon.svg";
// import { ReactComponent as TaskListOutlinedLtrIcon } from "@/icons/task-list-outlined-ltr-icon.svg";
// import { ReactComponent as ChatOutlinedDefaultIcon } from "@/icons/chat-outlined-default-icon.svg";
// import { ReactComponent as GridOutlinedDefaultIcon } from "@/icons/grid-outlined-default-icon.svg";
// import { ReactComponent as EditOutlinedSettingsIcon } from "@/icons/edit-outlined-settings-icon.svg";
// import { ReactComponent as EditFilledSettingsIcon } from "@/icons/edit-filled-settings-icon.svg";
// import { ReactComponent as ContactCardOutlinedDefaultIcon } from "@/icons/contact-card-outlined-default-icon.svg";
// import { ReactComponent as TaskListFilledLtrIcon } from "@/icons/task-list-filled-ltr-icon.svg";
// import { ReactComponent as ChatFilledDefaultIcon } from "@/icons/chat-filled-default-icon.svg";
// import { ReactComponent as GridFilledDefaultIcon } from "@/icons/grid-filled-default-icon.svg";
import Image from "next/image";
import React from "react";
import { DynamicMenuItem } from "@/core/contracts/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/stores/ui";

// Placeholder icon component
const PlaceholderIcon = ({ className, ...props }: { className?: string; [key: string]: any }) => <div className={className} {...props}>[Icon]</div>;

const iconMap: Record<
  string,
  {
    Outlined: React.FC<React.SVGProps<SVGSVGElement>>;
    Filled: React.FC<React.SVGProps<SVGSVGElement>>;
  }
> = {
  contact: {
    Outlined: PlaceholderIcon,
    Filled: PlaceholderIcon,
  },
  task: { 
    Outlined: PlaceholderIcon, 
    Filled: PlaceholderIcon 
  },
  proposal: {
    Outlined: PlaceholderIcon,
    Filled: PlaceholderIcon,
  },
  product: { 
    Outlined: PlaceholderIcon, 
    Filled: PlaceholderIcon 
  },
};

export default function LeftMenu({ items }: { items: DynamicMenuItem[] }) {
  const pathname = usePathname();
  const isMenuCollapsed = useUIStore((s) => s.menuState.isMenuCollapsed);
  const toggleMenu = useUIStore((s) => s.menuState.toggleMenu);

  const ToggleMenuIcon = PlaceholderIcon;

  const isActiveItem = (itemHref: string) => {
    return pathname.startsWith(itemHref);
  };

  return (
    <nav
      className="bg-brand-primary-600 group flex h-full min-h-0 w-full flex-col px-6 pt-2.5 pb-6"
      data-collapsed={isMenuCollapsed}
    >
      <div
        data-menu-item="logo"
        className="inline-flex h-8 w-full items-center justify-between"
      >
        <Link href="/dashboard">
          {isMenuCollapsed ? (
            <Image
              src="/images/logo-slim.svg"
              alt="Gomago CRM Logo"
              className="h-11 w-8 group-hover:hidden"
              width={37}
              height={44}
            />
          ) : (
            <Image
              src="/images/logo.svg"
              alt="Gomago CRM Logo"
              className="h-11 w-24"
              width={101}
              height={44}
            />
          )}
          {isMenuCollapsed && (
            <Image
              src="/images/logo.svg"
              alt="Gomago CRM Logo"
              className="hidden h-11 w-24 group-hover:block"
              width={101}
              height={44}
            />
          )}
        </Link>
        <button onClick={toggleMenu}>
          <div>
            <ToggleMenuIcon
              aria-hidden
              className="size-5 rotate-90 cursor-pointer text-white"
            />
          </div>
        </button>
      </div>
      <div className="left-menu__scroll scroll-thin mt-6 max-h-[calc(100vh-20rem)] min-h-0 w-full flex-1 overflow-y-auto pe-2 [scrollbar-gutter:stable]">
        <ul className="flex min-h-0 w-full flex-1 flex-col items-start justify-start gap-1">
          {items.map((item) => {
            const isActive = isActiveItem(item.href);
            const iconPair = iconMap[item.resource] ??
              iconMap[item.icon] ?? {
                Outlined: PlaceholderIcon,
                Filled: PlaceholderIcon,
              };
            const IconComponent = isActive
              ? iconPair.Filled
              : iconPair.Outlined;

            return (
              <li
                key={item.id}
                data-active={isActive}
                className="text-brand-primary-100 data-[active=true]:text-brand-white h-11 shrink-0 rounded-md px-3 py-1 text-sm group-data-[collapsed=false]:w-full group-data-[collapsed=true]:w-11 group-data-[collapsed=true]:group-hover:w-full hover:bg-white/10 data-[active=true]:bg-white/10"
              >
                <Link
                  href={item.href}
                  className="inline-flex h-full w-full items-center justify-start gap-3"
                >
                  <IconComponent className="size-5 shrink-0" />
                  <span className="left-menu__label overflow-hidden text-nowrap">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="h-px bg-white/20 group-data-[collapsed=false]:w-full group-data-[collapsed=true]:w-11 group-data-[collapsed=true]:group-hover:w-full" />
      <ul>
        <li
          data-active={isActiveItem("/page-wizard")}
          className="text-brand-primary-100 data-[active=true]:text-brand-white h-11 shrink-0 rounded-md px-0.5 pt-1 text-sm group-data-[collapsed=false]:w-full group-data-[collapsed=true]:w-11 group-data-[collapsed=true]:group-hover:w-full hover:hover:bg-white/10 data-[active=true]:bg-white/10"
        >
          <Link
            href="/page-wizard"
            className="flex h-full w-full items-center justify-between"
          >
            <span className="left-menu__label overflow-hidden text-nowrap">
              Page Wizard
            </span>
            <PlaceholderIcon className="size-5 group-data-[collapsed=true]:m-auto group-data-[collapsed=true]:group-hover:m-0" />
          </Link>
        </li>
        <li
          data-active={isActiveItem("/menu-wizard")}
          className="text-brand-primary-100 data-[active=true]:text-brand-white h-11 shrink-0 rounded-md px-0.5 pt-1 text-sm group-data-[collapsed=false]:w-full group-data-[collapsed=true]:w-11 group-data-[collapsed=true]:group-hover:w-full hover:hover:bg-white/10 data-[active=true]:bg-white/10"
        >
          <Link
            href="/menu-wizard"
            className="flex h-full w-full items-center justify-between"
          >
            <span className="left-menu__label overflow-hidden text-nowrap">
              Menu Wizard
            </span>
            <PlaceholderIcon className="size-5 group-data-[collapsed=true]:m-auto group-data-[collapsed=true]:group-hover:m-0" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
