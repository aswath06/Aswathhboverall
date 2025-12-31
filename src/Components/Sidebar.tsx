import { useState } from "react";
import {
  LayoutDashboard,
  Truck,
  Users,
  UserCheck,
  Boxes,
  ShoppingCart,
  FileText,
  LogOut,
} from "lucide-react";

interface MenuItem {
  name: string;
  icon: React.ElementType;
}

const menu: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Vehicles", icon: Truck },
  { name: "Drivers", icon: UserCheck },
  { name: "Customers", icon: Users },
  { name: "Stocks", icon: Boxes },
  { name: "Orders", icon: ShoppingCart },
  { name: "Invoices", icon: FileText },
];

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 text-xl font-bold text-orange-500">
        ASWATH HOLLOW BRICKS
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-1">
        {menu.map((item) => (
          <div
            key={item.name}
            onClick={() => setActivePage(item.name)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer
              ${
                activePage === item.name
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            <item.icon size={18} />
            {item.name}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t">
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer">
          <LogOut size={18} />
          Logout
        </div>
      </div>
    </aside>
  );
}
