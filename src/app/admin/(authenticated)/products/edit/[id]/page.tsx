import { AdminProductFormPageClient } from "./AdminProductFormPageClient";

export const metadata = {
  title: "Edit Product ",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminProductFormPageClient />;
}
