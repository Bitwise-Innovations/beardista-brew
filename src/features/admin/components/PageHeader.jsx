// Page title, one-line description, and an optional actions slot on the right.
// Wide action rows wrap under the title instead of squeezing it.
// inlineActionsOnPhone keeps a small action (like "+ Create") beside the title on phones.
export default function PageHeader({
  title,
  description,
  actions,
  showDescriptionOnPhone = false,
  inlineActionsOnPhone = false,
}) {
  return (
    <header
      className={`flex gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between ${
        inlineActionsOnPhone ? "flex-row items-start justify-between" : "flex-col"
      }`}
    >
      {/* With an action beside it on phones, the title takes the leftover width, wraps, and uses a smaller size. */}
      <div className={inlineActionsOnPhone ? "min-w-0 flex-1" : "min-w-0"}>
        <h1
          className={`font-bold tracking-tight text-[#19244E] sm:text-[1.75rem] sm:leading-9 ${
            inlineActionsOnPhone ? "text-lg leading-6" : "text-xl"
          }`}
        >
          {title}
        </h1>
        {description && (
          <p
            className={`mt-1 text-xs text-gray-500 sm:block sm:text-sm ${
              showDescriptionOnPhone ? "" : "hidden"
            }`}
          >
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div
          className={`flex flex-wrap items-center gap-2 ${
            inlineActionsOnPhone ? "shrink-0" : "min-w-0"
          }`}
        >
          {actions}
        </div>
      )}
    </header>
  );
}
