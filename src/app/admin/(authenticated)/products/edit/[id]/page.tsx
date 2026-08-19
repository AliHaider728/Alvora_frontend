import { AdminProductFormPageClient } from "./AdminProductFormPageClient";

export const metadata = {
  title: "Edit Product | Alvora Skincare Admin",
};

export default function Page({ params }: { params: { id: string } }) {
  return <AdminProductFormPageClient />;
}
