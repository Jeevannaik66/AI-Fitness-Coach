export default function Button({ children, ...props }) {
  return (
    <button {...props} className="px-3 py-1 bg-indigo-600 text-white rounded">
      {children}
    </button>
  );
}
