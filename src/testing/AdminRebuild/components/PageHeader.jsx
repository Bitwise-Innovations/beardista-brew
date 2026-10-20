import PrimaryButton from "./PrimaryButton";

export default function PageHeader({
  title,
  description,
  actionLabel,
  className = "",
}) {
  return (
    <header className={`mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#19244E] sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            {description}
          </p>
        )}
      </div>

      {actionLabel && <PrimaryButton>{actionLabel}</PrimaryButton>}
    </header>
  );
}
