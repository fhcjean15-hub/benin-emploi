export default function Button({
  children,
  variant = "primary",
  type = "button",
  className = "",
  ...props
}) {
  const base =
    "px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1";

  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-400",
    secondary: "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-gray-300",
    warning: "bg-yellow-400 text-white hover:bg-yellow-500 focus:ring-yellow-300",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
