import { useTheme } from "../context/ThemeContext";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { NavLink } from "react-router-dom";
import { type LucideIcon, Home, Users, Folder, CheckSquare } from "lucide-react";

interface NavLinkItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

export default function Sidebar() {
  const { theme } = useTheme();
  const role = useSelector((state: RootState) => state.auth.role);

  const links: Record<string, NavLinkItem[]> = {
    admin: [
      { name: "Dashboard", path: "/admin/home", icon: Home },
      { name: "Users", path: "/admin/users", icon: Users },
      { name: "Projects", path: "/admin/projects", icon: Folder },
      { name: "Tasks", path: "/admin/tasks", icon: CheckSquare },
    ],
    manager: [
      { name: "Dashboard", path: "/manager/home", icon: Home },
      { name: "Projects", path: "/manager/projects", icon: Folder },
      { name: "Tasks", path: "/manager/tasks", icon: CheckSquare },
    ],
    developer: [
      { name: "Dashboard", path: "/developer/home", icon: Home },
      { name: "My Tasks", path: "/developer/tasks", icon: CheckSquare },
    ],
  };

  const roleLinks = role ? links[role] || [] : [];

  return (
    <aside
      className={`w-64 min-h-screen p-4 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"} shadow-lg`}
    >
      <h2 className="text-xl font-bold mb-6 capitalize flex items-center gap-2">
        {role === "admin" && <Users className="w-6 h-6" />}
        {role === "manager" && <Folder className="w-6 h-6" />}
        {role === "developer" && <CheckSquare className="w-6 h-6" />}
        {role} Panel
      </h2>
      <nav className="flex flex-col gap-2">
        {roleLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded hover:bg-green-500 hover:text-white transition ${
                isActive ? "bg-green-500 text-white" : ""
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
