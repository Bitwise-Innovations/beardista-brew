export default function AdminCard({ children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      {children}
    </section>
  );
}
