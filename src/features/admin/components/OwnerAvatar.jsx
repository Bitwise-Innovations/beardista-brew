import { useState } from "react";
import { useStaffIdentity } from "./useStaffIdentity";

// Profile photo, or initials if there is no photo or it can't load.
export default function OwnerAvatar({ className = "h-9 w-9 text-xs" }) {
  const { photo, initials } = useStaffIdentity();
  const [photoFailed, setPhotoFailed] = useState(false);

  if (photo && !photoFailed) {
    return (
      <img
        src={photo}
        alt=""
        onError={() => setPhotoFailed(true)}
        className={`${className} shrink-0 rounded-full object-cover object-[50%_30%]`}
      />
    );
  }

  return (
    <span className={`${className} flex shrink-0 items-center justify-center rounded-full bg-[#19244E] font-bold text-white`}>
      {initials}
    </span>
  );
}