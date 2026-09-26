export const dynamic = 'force-dynamic';
import { CategoryPageClient } from "./CategoryPageClient";
import { api } from "../../../services/api";

import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  if (slug === 'all') {
    return { title: 'All Products', description: 'Explore all products at Alvora Skincare' };
  }
  try {
    const categories = await api.getCategories();
    if (!categories) {
      console.error(`[generateMetadata] api.getCategories returned null`);
    } else {
      const cat = categories.find((c: any) => c.slug === slug);
      if (cat) {
        return { 
          title: `${cat.name} `,
          description: cat.description || `Explore our selection of ${cat.name} products.`
        };
      }
    }
  } catch (e) {}
  
  return {
    title: `${slug} `,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;

  if (slug !== 'all') {
    const categories = await api.getCategories();
    const cat = categories?.find((c: any) => c.slug === slug);
    if (!cat) {
      console.error(`[Page] Category not found for slug: ${slug}`);
      notFound();
    }
  }

  return <CategoryPageClient />;
}
