import { BadgeCheck } from 'lucide-react';

export function ReviewVerificationBadge({ verifiedPurchase }: { verifiedPurchase: boolean }) {
  const label = verifiedPurchase ? 'Verified Purchase' : 'Verified by Alvora';

  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold leading-none text-emerald-700"
      title={verifiedPurchase ? 'Purchase confirmed' : 'Review approved by Alvora; purchase not confirmed'}
    >
      <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
