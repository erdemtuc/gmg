import "server-only";
import { unstable_cache } from "next/cache";
import { apiServer } from "@/infra/http/server";
import { getAuthUser } from "@/features/shared/services/auth-user";
import type { DynamicMenuItem } from "@/core/contracts/navigation";

const MENU_ENDPOINT = "/api/resource.php?resource_type=menu";
const MENU_REVALIDATE_SECONDS = 1800;

type RawMenuEntry = {
  title: string;
  id: string;
  resource: string;
  icon: string;
};

function resourceToHref(resource: string): string {
  switch (resource) {
    case "contact":
      return "/contacts";
    case "task":
      return "/activities";
    case "proposal":
      return "/proposals";
    case "product":
      return "/products";
    default:
      return `/${resource}s`;
  }
}

export async function getMenuItems(): Promise<DynamicMenuItem[]> {
  try {
    // Fetch menu items directly without cache due to cookie usage restrictions
    const raw = await apiServer<RawMenuEntry[]>(MENU_ENDPOINT, {
      method: "GET",
      auth: "include", // Use proper authentication with automatic refresh
    });
    const mapped = raw.flatMap((item): DynamicMenuItem[] => {
      const href = resourceToHref(item.resource);
      if (!href) return [];
      return [
        {
          id: item.id,
          label: item.title,
          href,
          icon: item.icon,
          resource: item.resource,
        },
      ];
    });
    return mapped;
  } catch (error) {
    console.error('Failed to fetch menu items from API:', error);
    // Return fallback menu items when API call fails
    return [
      { id: "1", label: "Contacts", href: "/contacts", icon: "contact", resource: "contact" },
      { id: "2", label: "Activities", href: "/activities", icon: "task", resource: "task" },
      { id: "3", label: "Proposals", href: "/proposals", icon: "proposal", resource: "proposal" },
      { id: "4", label: "Products", href: "/products", icon: "product", resource: "product" },
      { id: "5", label: "Opportunities", href: "/opportunities", icon: "opportunity", resource: "opportunity" },
    ];
  }
}
