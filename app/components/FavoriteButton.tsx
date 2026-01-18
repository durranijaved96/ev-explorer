"use client";
import { useEffect, useState } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

export default function FavoriteButton({ id }: { id: string }) {
  const key = "ev:favorites";
  const [fav, setFav] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      const list: string[] = raw ? JSON.parse(raw) : [];
      setFav(list.includes(id));
    } catch {
      setFav(false);
    }
  }, [id]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const raw = localStorage.getItem(key);
      const list: string[] = raw ? JSON.parse(raw) : [];
      let next: string[];
      if (list.includes(id)) next = list.filter((x) => x !== id);
      else next = [...list, id];
      localStorage.setItem(key, JSON.stringify(next));
      setFav(next.includes(id));
    } catch {
      // ignore
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={fav}
      className="p-2 rounded-md bg-white/90 dark:bg-neutral-800/70 hover:scale-105 transition shadow"
      title={fav ? "Remove favorite" : "Add favorite"}
    >
      {fav ? (
        <HeartSolid className="w-5 h-5 text-rose-500" />
      ) : (
        <HeartOutline className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />
      )}
    </button>
  );
}
