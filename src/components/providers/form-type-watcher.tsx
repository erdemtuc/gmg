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

  if (!formContext) {
    console.warn("FormTypeWatcher must be used within a FormProvider");
    return null;
  }

  useEffect(() => {
    const subscription = formContext.watch((value, { name }) => {
      if (name === typeFieldName) {
        const watchedType = value[typeFieldName] as string | undefined;
        if (watchedType && watchedType !== currentType) {
          updateTypeParam(watchedType, params, pathname, router, paramName);
        }
      }
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [formContext, typeFieldName, currentType, params, pathname, router, paramName]);

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
  if (sp.get(paramName) === next) {
    return;
  }
  sp.set(paramName, next);
  router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
}
