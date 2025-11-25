"use client";

import Image from "next/image";
import React from "react";
import { DynamicMenuItem } from "@/core/contracts/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/stores/ui";
import {
  User,
  UserRound,
  Clipboard,
  ClipboardList,
  FileText,
  FileTextIcon,
  Settings,
  Settings2,
  Menu,
  X,
  RotateCcw
} from 'lucide-react';

const iconMap: Record<
  string,
  {
    Outlined: React.FC<{ className?: string }>;
    Filled: React.FC<{ className?: string }>;
  }
> = {
  contact: {
    Outlined: User,
    Filled: UserRound,
  },
  task: {
    Outlined: Clipboard,
    Filled: ClipboardList,
  },
  proposal: {
    Outlined: FileText,
    Filled: FileTextIcon,
  },
  product: {
    Outlined: Settings,
    Filled: Settings2,
  },
};

export default function LeftMenu({ items }: { items: DynamicMenuItem[] }) {
  const pathname = usePathname();
  const isMenuCollapsed = useUIStore((s) => s.menuState.isMenuCollapsed);
  const toggleMenu = useUIStore((s) => s.menuState.toggleMenu);

  const ToggleMenuIcon = isMenuCollapsed ? Menu : X;

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
                Outlined: RotateCcw,
                Filled: RotateCcw,
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
            <RotateCcw className="size-5 group-data-[collapsed=true]:m-auto group-data-[collapsed=true]:group-hover:m-0" />
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
            <RotateCcw className="size-5 group-data-[collapsed=true]:m-auto group-data-[collapsed=true]:group-hover:m-0" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
