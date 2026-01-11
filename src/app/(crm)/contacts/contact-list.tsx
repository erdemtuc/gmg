"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClientGet } from "@/infra/http/client";
import { Contact } from "@/features/shared/models/contact-crud-models";
import ContactCard from "./contact-card";
import { ContactFilter, ContactSort } from "./use-contact-filters";

const PAGE_START = 1;

interface ContactListProps {
  filters: ContactFilter[];
  sort: ContactSort | null;
}

export default function ContactList({ filters, sort }: ContactListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const queryFn = useCallback(async ({ pageParam }: { pageParam: number }) => {
    const page = typeof pageParam === "number" ? pageParam : PAGE_START;
    // Fetch all contacts for now, filtering will be done client-side
    return apiClientGet<Contact[]>("/api/contacts", { query: { page } });
  }, []);

  const getNextPageParam = useCallback((lastPage: Contact[], allPages: Contact[][]) => {
    return lastPage.length > 0 ? allPages.length + PAGE_START : undefined;
  }, []);

  const query = useInfiniteQuery({
    queryKey: ["contacts"], // Keep query key stable
    initialPageParam: PAGE_START,
    queryFn,
    getNextPageParam,
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

  // Helper function to get a field value by name from additionalFields
  const getContactFieldValue = (contact: Contact, fieldName: string): string => {
    const field = contact.additionalFields.find(f => f.name === fieldName);
    return field?.value?.toString() || '';
  };

  // Client-side filtering and sorting
  let processedContacts = [...contacts];

  // Apply filters
  filters.forEach(filter => {
    processedContacts = processedContacts.filter(contact => {
      let contactValue = '';
      switch (filter.field) {
        case 'name':
          contactValue = contact.name || '';
          break;
        case 'email':
          contactValue = getContactFieldValue(contact, 'email');
          break;
        case 'company':
          contactValue = getContactFieldValue(contact, 'company');
          break;
        case 'phone':
          contactValue = getContactFieldValue(contact, 'phone');
          break;
        case 'status':
          contactValue = getContactFieldValue(contact, 'status');
          break;
        default:
          contactValue = '';
      }

      const filterValue = filter.value.toLowerCase();
      const contactValueLower = contactValue.toLowerCase();

      switch (filter.operator) {
        case 'contains':
          return contactValueLower.includes(filterValue);
        case 'equals':
          return contactValueLower === filterValue;
        case 'startsWith':
          return contactValueLower.startsWith(filterValue);
        case 'endsWith':
          return contactValueLower.endsWith(filterValue);
        default:
          return true;
      }
    });
  });

  // Apply sorting
  if (sort) {
    processedContacts.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      
      switch (sort.field) {
        case 'name':
          aVal = a.name || '';
          bVal = b.name || '';
          break;
        case 'email':
          aVal = getContactFieldValue(a, 'email');
          bVal = getContactFieldValue(b, 'email');
          break;
        case 'company':
          aVal = getContactFieldValue(a, 'company');
          bVal = getContactFieldValue(b, 'company');
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt || '').getTime();
          bVal = new Date(b.createdAt || '').getTime();
          break;
        default:
          aVal = '';
          bVal = '';
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const comparison = aVal.localeCompare(bVal);
        return sort.direction === 'asc' ? comparison : -comparison;
      } else {
        const comparison = (aVal as number) - (bVal as number);
        return sort.direction === 'asc' ? comparison : -comparison;
      }
    });
  }

  return (
    <div
      ref={containerRef}
      className="scroll-thin scrollbar-on-white scrollbar-gutter:stable] flex min-h-0 flex-1 flex-col gap-2 overflow-x-visible overflow-y-auto py-2 ps-2 pe-2"
    >
      {processedContacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
      <div ref={sentinelRef} />
      {query.isFetchingNextPage && (
        <div className="text-brand-gray-400 p-2 text-xs">Loading more…</div>
      )}
      {!query.hasNextPage && processedContacts.length === 0 && (
        <div className="text-brand-gray-500 p-4 text-center">No contacts match your filters</div>
      )}
      {!query.hasNextPage && processedContacts.length > 0 && (
        <div className="text-brand-gray-300 p-2 text-xs">No more results</div>
      )}
    </div>
  );
}
