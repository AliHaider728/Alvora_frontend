import { AdminProductFormPageClient } from "./AdminProductFormPageClient";

export const metadata = {
  title: "Edit Product | PlayBimboo Admin",
};

export default function Page({ params }: { params: { id: string } }) {
  return <AdminProductFormPageClient />;
}
