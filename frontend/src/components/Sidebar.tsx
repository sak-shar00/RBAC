import { useTheme } from "../context/ThemeContext";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { NavLink } from "react-router-dom";

interface NavLinkItem {
  name: string;
  path: string;
  icon?: string;
}

export default function Sidebar() {
  const { theme } = useTheme();
  const role = useSelector((state: RootState) => state.auth.role);

  const links: Record<string, NavLinkItem[]> = {
    admin: [
      { name: "Dashboard", path: "/admin/home", icon: "🏠" },
      { name: "Users", path: "/admin/users", icon: "👥" },
      { name: "Projects", path: "/admin/projects", icon: "📁" },
      { name: "Tasks", path: "/admin/tasks", icon: "✅" },
    ],
    manager: [
      { name: "Dashboard", path: "/manager/home", icon: "🏠" },
      { name: "Projects", path: "/manager/projects", icon: "📁" },
      { name: "Tasks", path: "/manager/tasks", icon: "✅" },
    ],
    developer: [
      { name: "Dashboard", path: "/developer/home", icon: "🏠" },
      { name: "My Tasks", path: "/developer/tasks", icon: "✅" },
    ],
  };

  const roleLinks = role ? links[role] || [] : [];

  return (
    <aside
      className={`w-64 min-h-screen p-4 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"} shadow-lg`}
    >
      <h2 className="text-xl font-bold mb-6 capitalize">{role} Panel</h2>
      <nav className="flex flex-col gap-2">
        {roleLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-500 hover:text-white transition ${
                isActive ? "bg-blue-500 text-white" : ""
              }`
            }
          >
            <span>{link.icon}</span>
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
