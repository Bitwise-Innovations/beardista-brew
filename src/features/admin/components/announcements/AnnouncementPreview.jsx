import { ArrowRight, Link2 } from "lucide-react";
import { typeLabel } from "./announcementUtils";

// The card as it looks in the "What's Brewing" section of the customer landing page:
// navy background, cream card, small orange type label, title, text, orange button with an arrow.
export default function AnnouncementPreview({ values, linkText }) {
  return (
    <div className="rounded-2xl bg-[#19244E] p-4 sm:p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
        What's Brewing
      </p>

      <article className="mt-3 overflow-hidden rounded-2xl bg-[#FFF3E7] shadow-lg">
        {values.image_url && (
          <img src={values.image_url} alt="" className="aspect-[16/9] w-full object-cover" />
        )}
        <div className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#E58422]">
            {typeLabel(values)}
          </p>
          <h3 className="mt-1 break-words text-lg font-bold leading-snug text-[#19244E]">
            {values.title.trim() || "Your title goes here"}
          </h3>
          <p className="mt-2 break-words text-sm leading-6 text-[#19244E]/75">
            {values.description.trim() || "A short description customers will read on the landing page."}
          </p>
          {values.button_label.trim() && (
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#E58422] px-4 py-2 text-sm font-bold text-white">
              {values.button_label.trim()}
              <ArrowRight size={16} />
            </span>
          )}
        </div>
      </article>

      {linkText && (
        <p className="mt-3 flex items-center gap-1.5 break-all text-[11px] text-white/60">
          <Link2 size={12} className="shrink-0" />
          Button opens {linkText}
        </p>
      )}
    </div>
  );
}
