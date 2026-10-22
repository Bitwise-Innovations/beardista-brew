import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import BrewingLoader, { SteamingCup } from "./BrewingLoader";

// The .lottie file is looked up in AdminRebuild/assets first, then src/testing/assets (where it is now).
// import.meta.glob returns nothing for a missing file, so the app never crashes; the cup is shown instead.
const animationFiles = import.meta.glob(
  ["../assets/barista-animation.lottie", "../../assets/barista-animation.lottie"],
  { eager: true, query: "?url", import: "default" }
);
const ANIMATION_URL = Object.values(animationFiles)[0] ?? null;

// If the player has not loaded after this long (slow or offline), show the cup instead.
const LOAD_TIMEOUT_MS = 8000;

export default function BaristaAnimation({ className = "" }) {
  const [player, setPlayer] = useState(null);
  const [status, setStatus] = useState(ANIMATION_URL ? "loading" : "failed");

  useEffect(() => {
    if (!player) return;

    const onLoad = () => setStatus("ready");
    const onError = () => setStatus("failed");
    player.addEventListener("load", onLoad);
    player.addEventListener("loadError", onError);
    if (player.isLoaded) setStatus("ready");

    return () => {
      player.removeEventListener("load", onLoad);
      player.removeEventListener("loadError", onError);
    };
  }, [player]);

  useEffect(() => {
    if (status !== "loading") return;
    const timer = setTimeout(() => setStatus("failed"), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [status]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative flex aspect-square w-full max-w-[22rem] items-center justify-center">
        {status === "failed" ? (
          <SteamingCup size={160} cupColor="#E58422" saucerColor="#FFF3E7" steamColor="rgba(255,255,255,0.75)" />
        ) : (
          <>
            <DotLottieReact
              src={ANIMATION_URL}
              loop
              autoplay
              dotLottieRefCallback={setPlayer}
              className={`h-full w-full transition-opacity duration-500 ${status === "ready" ? "opacity-100" : "opacity-0"}`}
            />
            {status === "loading" && (
              <BrewingLoader tone="light" className="absolute" />
            )}
          </>
        )}
      </div>
      <p className="font-display mt-4 text-center text-lg font-bold text-white/90 sm:text-xl">
        Crafted with passion. Served with character.
      </p>
    </div>
  );
}
