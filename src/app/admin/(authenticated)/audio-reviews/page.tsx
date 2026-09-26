import { Metadata } from "next";
import AdminAudioReviewsPageClient from "./AdminAudioReviewsPageClient";

export const metadata: Metadata = {
  title: "Audio Reviews | Admin",
};

export default function AdminAudioReviewsPage() {
  return <AdminAudioReviewsPageClient />;
}
