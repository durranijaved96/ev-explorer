"use client";
import { useState } from "react";
import Image from "next/image";

export default function Gallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  return (
    <div className="space-y-3">
      <div className="aspect-video relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
        <Image
          src={main}
          alt={`Photo ${active + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.slice(0,10).map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-[4/3] overflow-hidden rounded border ${i === active ? "border-black/60 dark:border-white/60" : "border-transparent"}`}
              aria-label={`Show image ${i + 1}`}
            >
              <Image src={src} alt={`Thumb ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
