import type { Announcement } from "./types";

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const hasEvent = Boolean(announcement.eventDate);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-canarinhos-blue">
          {announcement.title}
        </h3>
        {hasEvent && (
          <time className="shrink-0 rounded bg-canarinhos-gold/10 px-2 py-0.5 text-xs font-medium text-canarinhos-blue">
            {new Date(announcement.eventDate!).toLocaleDateString("pt-BR")}
          </time>
        )}
      </header>

      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {announcement.content}
      </p>

      {announcement.location && (
        <p className="mt-3 flex items-center gap-1 text-xs text-slate-500">
          <span aria-hidden>📍</span>
          {announcement.location}
        </p>
      )}
    </article>
  );
}