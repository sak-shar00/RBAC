interface CardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: string;
  onClick?: () => void;
}

export default function Card({ title, value, description, icon, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition ${
        onClick ? "cursor-pointer" : ""
      } bg-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
        </div>
        {icon && <span className="text-4xl">{icon}</span>}
      </div>
    </div>
  );
}
