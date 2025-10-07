"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose?: () => void;
}) {
  const router = useRouter();
  const close = () => (onClose ? onClose() : router.back());

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []); // eslint-disable-line

  // lock body scroll
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, []);

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
      {/* backdrop */}
      <button
        aria-label="Close overlay"
        onClick={close}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* container: full-screen on mobile, card on ≥sm */}
      <div className="absolute inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4">
  <div
    className="
      relative
      w-full sm:w-auto
      h-[100svh] sm:h-auto
      sm:max-h-[90vh] sm:max-w-5xl
      bg-white dark:bg-neutral-900 shadow-2xl
      rounded-t-3xl sm:rounded-2xl
      overflow-y-auto
      transition-all duration-300
    "
  >

          <button
            onClick={close}
            className="
              absolute right-3 top-3 sm:right-4 sm:top-4 z-20
              inline-flex h-9 w-9 items-center justify-center
              rounded-full bg-black/70 text-white hover:bg-black/80
            "
            aria-label="Close"
          >
            ✕
          </button>

          {/* padding leaves space for the close button on small screens */}
          <div className="p-3 sm:p-6 pt-14 sm:pt-6">{children}</div>

        </div>
      </div>
    </div>
  );
}
