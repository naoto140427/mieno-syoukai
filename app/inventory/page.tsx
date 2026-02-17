import Inventory from "@/components/Inventory";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resource & Inventory (装備・資材管理)",
  description: "Internal ERP for Mieno Corp. - Manage consumables, tools, and equipment status.",
};

export default function InventoryPage() {
  return <Inventory />;
}
