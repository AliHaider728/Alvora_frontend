import { CategoryPageClient } from "./CategoryPageClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  return {
    title: `${slug} | PlayBimboo`,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <CategoryPageClient />;
}
