import "server-only";
import { unstable_cache } from "next/cache";
import { apiServer } from "@/infra/http/server";
import { getAuthUser } from "@/features/shared/services/auth-user";
import type { DynamicMenuItem } from "@/core/contracts/navigation";
import { getAccessCookie } from "@/infra/auth/cookies-server";

const MENU_ENDPOINT = "/resource.php?resource_type=menu";
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
  const { id: userId, orgId } = await getAuthUser();
  const accessToken = await getAccessCookie();

  const keyParts = [`menu:user:${userId}`];
  const tags = [
    "menu",
    `user:${userId}`,
    `org:${orgId}`,
    `menu:user:${userId}`,
    `menu:org:${orgId}`,
  ];

  const cached = unstable_cache(
    async () => {
      const raw = await apiServer<RawMenuEntry[]>(MENU_ENDPOINT, {
        method: "GET",
        auth: "omit",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
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
    },
    keyParts,
    { tags, revalidate: MENU_REVALIDATE_SECONDS },
  );

  return cached();
}
