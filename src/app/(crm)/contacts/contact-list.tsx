"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClientGet } from "@/infra/http/client";
import { Contact } from "@/features/shared/models/contact-crud-models";
import ContactCard from "./contact-card";

const PAGE_START = 1;

export default function ContactList() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const query = useInfiniteQuery({
    queryKey: ["contacts"],
    initialPageParam: PAGE_START,
    queryFn: async ({ pageParam }) => {
      const page = typeof pageParam === "number" ? pageParam : PAGE_START;
      return apiClientGet<Contact[]>("/api/contacts", { query: { page } });
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + PAGE_START : undefined;
    },
  });

  const { hasNextPage, fetchNextPage } = query;

  useEffect(() => {
    if (!sentinelRef.current || !containerRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) fetchNextPage();
      },
      { root: containerRef.current, rootMargin: "200px 0px" },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  if (query.status === "pending") {
    return <div className="p-4 text-sm">Loading…</div>;
  }
  if (query.status === "error") {
    return (
      <div className="p-4 text-sm text-red-600">
        {(query.error as Error)?.message || "Failed to load"}
      </div>
    );
  }

  const contacts = (query.data?.pages ?? []).flat();

  return (
    <div
      ref={containerRef}
      className="scroll-thin scrollbar-on-white scrollbar-gutter:stable] flex min-h-0 flex-1 flex-col gap-2 overflow-x-visible overflow-y-auto py-2 ps-2 pe-2"
    >
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
      <div ref={sentinelRef} />
      {query.isFetchingNextPage && (
        <div className="text-brand-gray-400 p-2 text-xs">Loading more…</div>
      )}
      {!query.hasNextPage && (
        <div className="text-brand-gray-300 p-2 text-xs">No more results</div>
      )}
    </div>
  );
}
