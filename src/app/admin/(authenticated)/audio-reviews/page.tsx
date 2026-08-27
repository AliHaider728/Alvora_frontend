import { Metadata } from "next";
import AdminAudioReviewsPageClient from "./AdminAudioReviewsPageClient";

export const metadata: Metadata = {
  title: "Audio Reviews | Admin | Alvora",
};

export default function AdminAudioReviewsPage() {
  return <AdminAudioReviewsPageClient />;
}
