"use server";

import { getMenuItems } from "@/features/navigation/data";

export async function fetchMenuItems() {
  try {
    const items = await getMenuItems();
    // TODO: Remove this once we have a proper routing setup
    const updatedItems = items.map((item) => {
      if (
        !["/contacts", "/activities", "/proposals", "/products"].includes(
          item.href,
        )
      ) {
        return { ...item, href: "/dashboard" };
      }
      return item;
    });
    return updatedItems;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
}