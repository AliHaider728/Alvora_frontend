import { CheckoutPageClient } from "./CheckoutPageClient";

export const metadata = {
  title: "Checkout ",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  return <CheckoutPageClient receiptId={order} />;
}
