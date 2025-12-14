"use client";

import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@/assets/icons/dismiss-outlined-default-icon.svg";
import Image from "next/image";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: number | string;
  overlayClassName?: string;
  panelClassName?: string;
  hideCloseButton?: boolean;
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  width = 720,
  overlayClassName,
  panelClassName,
  hideCloseButton,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const container = useMemo(
    () => (typeof window !== "undefined" ? document.body : null),
    [],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(t);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !container) return null;

  return createPortal(
    <div aria-hidden={!isOpen} className="z-[100]">
      <div
        className={
          "fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[100]" +
          (overlayClassName ? " " + overlayClassName : "")
        }
        onClick={onClose}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] " +
          "max-h-[85vh] w-[calc(100%_-_32px)] rounded-xl bg-white text-[#000]" +
          "shadow-[0_20px_50px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden" +
          (panelClassName ? " " + panelClassName : "")
        }
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="p-4 flex-shrink-0">
            <h2 className="text-brand-gray-600 text-base font-medium">
              {title}
            </h2>
          </div>
        )}
        {!hideCloseButton && (
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute top-5 right-4 cursor-pointer leading-none text-[#61646C] z-[102]"
          >
            <Image src={CloseIcon || null} width={20} height={20} alt="" className="size-5" />
          </button>
        )}
        <div className="flex-1 overflow-y-auto overflow-x-hidden rounded-b-xl">
          {children}
        </div>
      </div>
    </div>,
    container,
  );
}
