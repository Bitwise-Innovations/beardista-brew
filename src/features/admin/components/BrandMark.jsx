import { Coffee } from "lucide-react";
import { LOGO_URL } from "./brandAssets";

// The Beardista logo when a logo file exists, otherwise the orange cup icon.
export default function BrandMark({ size = "md" }) {
  const box = size === "lg" ? "h-14 w-14 rounded-2xl" : "h-10 w-10 rounded-xl";

  if (LOGO_URL) {
    return <img src={LOGO_URL} alt="Beardista Brew" className={`${box} shrink-0 bg-white object-contain p-1`} />;
  }

  return (
    <div className={`${box} flex shrink-0 items-center justify-center bg-[#E58422] text-white`}>
      <Coffee size={size === "lg" ? 28 : 22} />
    </div>
  );
}
