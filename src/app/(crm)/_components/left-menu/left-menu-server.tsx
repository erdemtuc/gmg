import { getMenuItems } from "@/features/navigation/data";
import LeftMenu from "./left-menu";

export default async function LeftMenuServer() {
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

  return <LeftMenu items={updatedItems} />;
}
