"use client";

import Image from "next/image";
import { useRef } from "react";

type Photo = { src: string; alt: string };
type Section = { id: string; title: string; subtitle?: string; photos: Photo[] };

// reuse your photos
const photos: Photo[] = [
  { src: "/japan/eddie.jpeg", alt: "Eddie pointing" },
  { src: "/japan/meow.jpeg", alt: "Shiesty" },
  { src: "/japan/patrick.jpeg", alt: "Dohhhh" },
];

// split into sections however you want (add more sections + photos later)
const SECTIONS: Section[] = [
  {
    id: "day1",
    title: "Day 1",
    subtitle: "Landing + first chaos",
    photos,
  },
  {
    id: "day2",
    title: "Day 2",
    subtitle: "Wandering + food",
    photos,
  },
  {
    id: "day3",
    title: "Day 3",
    subtitle: "Random moments",
    photos,
  },
];

export default function MontagePage() {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const jumpTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  return (
    <main className="min-h-screen flex bg-slate-950">
      {/* Left menu (desktop) */}
      <aside className="hidden lg:flex lg:w-64 flex-col border-r border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-semibold text-slate-50">Japan Trip ✨</h1>
          <p className="text-xs text-slate-400 mt-1">
            Horizontal scrapbook. Click to jump.
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => jumpTo(s.id)}
              className="w-full text-left px-3 py-2 rounded-lg border border-transparent hover:border-slate-600 hover:bg-slate-900/60 text-slate-200 transition"
            >
              <div className="text-sm font-medium">{s.title}</div>
              {s.subtitle && (
                <div className="text-xs text-slate-400 truncate">{s.subtitle}</div>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Top chips (mobile) */}
        <header className="lg:hidden sticky top-0 z-10 bg-slate-950/90 backdrop-blur border-b border-slate-800">
          <div className="px-4 py-3">
            <h1 className="text-lg font-semibold text-slate-50">Japan Trip ✨</h1>
            <p className="text-xs text-slate-400">Swipe horizontally. Tap a section to jump.</p>
          </div>
          <div className="px-3 pb-3 overflow-x-auto">
            <div className="flex gap-2 text-xs">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => jumpTo(s.id)}
                  className="px-3 py-1 rounded-full bg-slate-800 text-slate-100 whitespace-nowrap hover:bg-slate-700"
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Horizontal scroll “pages” w/ paper grid background */}
        <div
          className="flex-1 overflow-x-auto overflow-y-hidden"
          style={{
            backgroundColor: "#fdfaf5",
            backgroundImage: `
              linear-gradient(to right, rgba(148,163,184,0.25) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(148,163,184,0.25) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        >
          <div className="flex h-[calc(100vh-3.5rem)] lg:h-screen snap-x snap-mandatory">
            {SECTIONS.map((s) => (
              <section
                key={s.id}
                ref={(el: HTMLDivElement | null) => {
                    sectionRefs.current[s.id] = el;
                }}
                className="min-w-full snap-start flex flex-col px-6 md:px-10 py-8"
              >
                {/* Section header */}
                <div className="max-w-5xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-200/80 px-3 py-1 text-[11px] font-medium tracking-wide text-slate-600 uppercase mb-3">
                    <span>Section</span>
                    <span className="text-[10px] text-slate-500">{s.id}</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
                    {s.title}
                  </h2>

                  {s.subtitle && (
                    <p className="mt-2 text-sm md:text-base text-slate-600 max-w-xl">
                      {s.subtitle}
                    </p>
                  )}
                </div>

                {/* Horizontal photo strip */}
                <div className="mt-6 md:mt-8 flex-1">
                  <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 pr-4">
                    {s.photos.map((p) => (
                      <div
                        key={`${s.id}-${p.src}`}
                        className="relative flex-shrink-0 w-[70vw] sm:w-[52vw] md:w-[360px] lg:w-[420px] aspect-[4/5] rounded-2xl overflow-hidden bg-slate-200 shadow-[0_18px_40px_rgba(15,23,42,0.25)]"
                      >
                        <Image
                          src={p.src}
                          alt={p.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 360px, 420px"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between text-[11px] text-slate-500">
                  <span>Scroll → for more</span>
                  <span className="hidden sm:inline">Use menu to jump sections</span>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
