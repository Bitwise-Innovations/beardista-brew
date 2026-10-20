export default function ModalWrapper({
  title,
  description,
  children,
  className = "",
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-950/50 p-4 sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title || "Dialog"}
        className={`my-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8 ${className}`}
      >
        {title && (
          <h2 className="text-xl font-extrabold text-[#19244E]">
            {title}
          </h2>
        )}

        {description && (
          <p className="mt-2 text-sm leading-6 text-gray-500">
            {description}
          </p>
        )}

        <div className="mt-6">{children}</div>
      </section>
    </div>
  );
}
