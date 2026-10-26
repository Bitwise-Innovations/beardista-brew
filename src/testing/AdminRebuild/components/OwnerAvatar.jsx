import { useState } from "react";
import { OWNER } from "./brandAssets";

// Owner photo, or the "JC" initials if the photo cannot load.
export default function OwnerAvatar({ className = "h-9 w-9 text-xs" }) {
  const [photoFailed, setPhotoFailed] = useState(false);

  if (OWNER.photo && !photoFailed) {
    return (
      <img
        src={OWNER.photo}
        alt=""
        onError={() => setPhotoFailed(true)}
        className={`${className} shrink-0 rounded-full object-cover object-[50%_30%]`}
      />
    );
  }

  return (
    <span className={`${className} flex shrink-0 items-center justify-center rounded-full bg-[#19244E] font-bold text-white`}>
      {OWNER.initials}
    </span>
  );
}
