export default function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-white text-gray-700 border border-gray-200",
    success: "bg-green-100 text-green-700 border border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    danger: "bg-red-100 text-red-700 border border-red-200",
  };

  return (
    <span
      className={`
        inline-flex items-center
        px-3 py-1
        text-xs font-semibold
        rounded-full
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
}
