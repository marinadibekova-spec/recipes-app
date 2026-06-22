import Link from "next/link";

export default function PageHeader({
  title,
  description,
  actionLabel,
  actionHref,
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>

      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}