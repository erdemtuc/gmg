"use server";

import { getMenuItems } from "@/features/navigation/data";

export async function fetchMenuItems() {
  try {
    const items = await getMenuItems();
    // TODO: Remove this once we have a proper routing setup
    const updatedItems = items.map((item) => {
      if (
        !["/contacts", "/activities", "/proposals", "/products", "/opportunity"].includes(
          item.href,
        )
      ) {
        return { ...item, href: "/dashboard" };
      }
      return item;
    });

    // Manually add Proposal if it doesn't exist (for development/demo)
    if (!updatedItems.find(item => item.href === "/proposals")) {
      updatedItems.push({
        id: "proposal-manual",
        label: "Proposal",
        href: "/proposals",
        icon: "message-square", // Assuming this icon exists or is handled
        resource: "proposal"
      });
    }

    // Manually add Opportunity if it doesn't exist (for development/demo)
    if (!updatedItems.find(item => item.href === "/opportunity")) {
      updatedItems.push({
        id: "opportunity-manual",
        label: "Opportunity",
        href: "/opportunity",
        icon: "briefcase", // Using briefcase icon for opportunity
        resource: "opp"
      });
    }

    return updatedItems;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
}