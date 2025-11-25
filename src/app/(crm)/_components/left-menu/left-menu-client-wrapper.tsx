"use client";

import { useUIStore } from "@/stores/ui";
import { useEffect, useState } from "react";
import LeftMenu from "./left-menu";
import { fetchMenuItems } from "../../_actions/menu-actions";

export default function LeftMenuClientWrapper() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const isMenuCollapsed = useUIStore((s) => s.menuState.isMenuCollapsed);

  // Update the CSS variable when the menu state changes
  useEffect(() => {
    const root = document.querySelector('.app-shell');
    if (root) {
      (root as HTMLElement).style.setProperty('--left-menu-w', isMenuCollapsed ? '6.5rem' : '15rem');
    }
  }, [isMenuCollapsed]);

  // Fetch menu items on mount
  useEffect(() => {
    const loadMenuItems = async () => {
      console.log('loading menu items');
      const items = await fetchMenuItems();
      console.log('menuitems', items);
      setMenuItems(items);
    };

    loadMenuItems();
  }, []);

  return <LeftMenu items={menuItems} />;
}