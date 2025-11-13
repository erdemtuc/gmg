"use client";

import { useEffect, useRef, useState } from "react";
// import { ReactComponent as ChevronOutlinedUpIcon } from "@/icons/chevron-outlined-up-icon.svg";
// import { ReactComponent as ToggleOutlinedMultipleIcon } from "@/icons/toggle-outlined-multiple-icon.svg";
// import { ReactComponent as SignOutOutlinedIcon } from "@/icons/sign-out-outlined-icon.svg";
// import { ReactComponent as PeopleOutlinedDefaultIcon } from "@/icons/people-outlined-default-icon.svg";
import { logoutAction } from "@/features/auth/actions";

import { StaticMenuItem } from "@/core/contracts/navigation";

type UserInfo = { name: string; email: string; avatar?: string };
const userInfo: UserInfo = { name: "John Doe", email: "john.doe@example.com" };

// Using a placeholder component instead of SVG icons
const PlaceholderIcon = ({ className, ...props }: { className?: string; [key: string]: any }) => <div className={className} {...props}>[Icon]</div>;

const menuItems: StaticMenuItem[] = [
  {
    id: "permission-management",
    label: "User and Permission Management",
    href: "/permission-management",
    IconOutlined: PlaceholderIcon,
    IconFilled: PlaceholderIcon,
  },
  {
    id: "user-restriction",
    label: "User Restriction",
    href: "/user-restriction",
    IconOutlined: PlaceholderIcon,
    IconFilled: PlaceholderIcon,
  },
  {
    id: "log-out",
    label: "Log Out",
    href: "/log-out",
    IconOutlined: PlaceholderIcon,
    IconFilled: PlaceholderIcon,
  },
];

export default function AccountMenu() {
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const firstItemRef = useRef<HTMLButtonElement | null>(null);

  const menuId = "account-menu";

  // Focus management: focus first item on open; return focus to button on close
  useEffect(() => {
    if (open) {
      // wait for paint so the element exists
      requestAnimationFrame(() => firstItemRef.current?.focus());
    } else {
      // on close, return focus to the trigger for good a11y
      buttonRef.current?.focus();
    }
  }, [open]);

  // Attach global listeners only when menu is open
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Optional nicety: ArrowUp/ArrowDown to move between menuitems
  const onMenuKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!menuRef.current) return;
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

    const items = Array.from(
      menuRef.current.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'),
    );
    if (items.length === 0) return;

    e.preventDefault();
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      e.key === "ArrowDown"
        ? items[(i + 1 + items.length) % items.length]
        : items[(i - 1 + items.length) % items.length];
    next?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        id="account-menu-button"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="aria-[expanded=true]:bg-brand-primary-50 group hover:bg-brand-gray-50 inline-flex cursor-pointer items-center gap-3 rounded-md p-1 transition-colors"
      >
        <span className="bg-brand-success-400 flex h-8 w-8 items-center justify-center rounded-full">
          <span className="text-sm font-medium text-white">
            {userInfo.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </span>

        <span className="inline-flex flex-col items-start gap-0.5 text-left">
          <span className="text-brand-gray-600 group-aria-[expanded=true]:text-brand-primary-500 text-sm leading-4 font-medium">
            {userInfo.name}
          </span>
          <span className="text-brand-gray-400 group-aria-[expanded=true]:text-brand-primary-300 text-xs leading-4 tracking-[0.1px]">
            {userInfo.email}
          </span>
        </span>

        <PlaceholderIcon
          className="text-brand-gray-400 group-aria-[expanded=true]:text-brand-primary-500 ml-2 size-4 transition-transform duration-200 ease-out group-aria-[expanded=false]:rotate-180"
          aria-hidden
        />
      </button>

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label="Account"
          aria-labelledby="account-menu-button"
          onKeyDown={onMenuKeyDown}
          className="border-brand-gray-200 absolute top-full right-0 z-50 mt-2 flex w-96 flex-col gap-0.5 border bg-white px-4 py-2 shadow-lg focus:outline-none"
        >
          {menuItems.map((item, index) => (
            <div key={item.id}>
              {item.id === "log-out" && (
                <div className="bg-brand-gray-200 my-1 h-px w-full" />
              )}
              <button
                ref={index === 0 ? firstItemRef : null}
                role="menuitem"
                className={`flex w-full items-center gap-3 rounded py-2 text-sm font-medium ${
                  item.id === "log-out"
                    ? "text-brand-error-500"
                    : "text-brand-gray-600"
                } hover:bg-brand-gray-50 focus:bg-brand-gray-50 focus:outline-none`}
                onClick={() => {
                  setOpen(false);
                  if (item.id === "log-out") {
                    void logoutAction();
                  }
                }}
              >
                <item.IconOutlined />
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
