import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel = "View all",
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6 md:mb-12">
      <div>
        {eyebrow && <p className="text-eyebrow mb-3 text-muted">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {href && (
        <Link href={href} className="btn btn-ghost shrink-0">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
