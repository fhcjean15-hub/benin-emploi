export default function Card({ children, className = "", variant = "default" }) {
  const variants = {
    default: "bg-white border border-gray-200",
    success: "bg-green-50 border border-green-200",
    warning: "bg-yellow-50 border border-yellow-200",
    danger: "bg-red-50 border border-red-200",
  };

  return (
    <div
      className={`
        rounded-lg shadow-md p-6
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
