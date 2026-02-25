interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "green" | "red" | "yellow";
}

const variantClasses = {
  default: "bg-gray-100 text-gray-700",
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-800",
  yellow: "bg-yellow-100 text-yellow-800",
};

export default function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-sm font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
