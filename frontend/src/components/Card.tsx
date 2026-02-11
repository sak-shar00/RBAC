import { useNavigate } from "react-router-dom";
import { type LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  navigateTo?: string;
}

export default function Card({ title, value, description, icon: Icon, navigateTo }: CardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${
        navigateTo ? "cursor-pointer" : ""
      } bg-white dark:bg-gray-800`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm dark:text-gray-400">{title}</h3>
          <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{value}</p>
          {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
        </div>
        {Icon && (
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
            <Icon className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        )}
      </div>
    </div>
  );
}
