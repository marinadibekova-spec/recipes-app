import Link from 'next/link'

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
      {/* Empty-state content */}
      <h2 className="text-xl font-medium text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{description}</p>

      {/* Empty-state action */}
      <div className="mt-6">
        <Link
          href={actionHref}
          className="inline-flex items-center rounded-2xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          {actionLabel}
        </Link>
      </div>
    </div>
  )
}