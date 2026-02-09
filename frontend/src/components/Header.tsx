import { useTheme } from "../context/ThemeContext";
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-bold">RBAC System</h1>
      <div className="flex gap-4">
        <button onClick={toggleTheme} className="px-3 py-1 border rounded">
          Toggle Theme
        </button>
        <button onClick={handleLogout} className="px-3 py-1 border rounded bg-red-500 text-white hover:bg-red-600 transition">
          Logout
        </button>
      </div>
    </header>
  );
}