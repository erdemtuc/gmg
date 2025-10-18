"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface FormTypeWatcherProps {
  currentType: string | null;
  typeFieldName?: string;
  paramName?: string;
}

export function FormTypeWatcher({
  currentType,
  typeFieldName = "type",
  paramName = "contact_add_type",
}: FormTypeWatcherProps) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Use form context to watch the type field
  const formContext = useFormContext();

  // Always call hooks at the top level
  const { watch } = formContext || {};
  const watchedType = watch
    ? (watch(typeFieldName) as string | undefined)
    : undefined;

  useEffect(() => {
    if (!formContext) {
      console.warn("FormTypeWatcher must be used within a FormProvider");
      return;
    }

    if (watchedType && watchedType !== currentType) {
      updateTypeParam(watchedType, params, pathname, router, paramName);
    }
  }, [
    watchedType,
    currentType,
    params,
    pathname,
    router,
    paramName,
    formContext,
  ]);

  if (!formContext) {
    return null;
  }

  return null; // This provider doesn't render anything
}

function updateTypeParam(
  next: string,
  params: ReturnType<typeof useSearchParams>,
  pathname: string,
  router: ReturnType<typeof useRouter>,
  paramName: string,
) {
  const sp = new URLSearchParams(Array.from(params.entries()));
  sp.set(paramName, next);
  router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
}
