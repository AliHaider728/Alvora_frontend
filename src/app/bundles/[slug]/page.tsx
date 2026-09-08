export const revalidate = 60; // Enable ISR

import { api } from "../../../services/api";
import { BundleDetailPageClient } from "./BundleDetailPageClient";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const defaultDesc = "Shop premium skincare bundles in Pakistan with Cash on Delivery & Free Express Shipping.";

  try {
    const bundle = await api.getBundle(slug);
    if (!bundle) {
      return { title: Bundle | Alvora Skincare };
    }

    const finalTitle = ${bundle.name} | Alvora Skincare Bundles;
    const finalDesc = bundle.description || defaultDesc;
    const imageUrl = bundle.image || '/images/hero/alvora-hero.png';
    
    return {
      title: finalTitle,
      description: finalDesc,
      alternates: {
        canonical: https://alvora.pk/bundles/ + slug
      },
      openGraph: {
        title: finalTitle,
        description: finalDesc,
        images: [imageUrl],
        type: 'website'
      },
      twitter: {
        card: 'summary_large_image',
        title: finalTitle,
        description: finalDesc,
        images: [imageUrl]
      }
    };
  } catch (e) {
    return { title: Bundle | Alvora Skincare };
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  
  let bundle = null;
  let reviews = [];
  let relatedBundles = [];
  
  try {
    const [fetchedBundle, fetchedRelated] = await Promise.all([
      api.getBundle(slug),
      api.getBundles().catch(() => ({ bundles: [] }))
    ]);

    bundle = fetchedBundle;
    relatedBundles = (fetchedRelated.bundles || []).filter((b: any) => b.slug !== slug).slice(0, 4);

    if (!bundle) {
      notFound();
    }
    
    // Fetch reviews using bundle.id (bundles have their own reviews)
    reviews = await api.getProductReviews(bundle.id).catch(() => []);

  } catch (e) {
    console.error([Page] Error fetching bundle for slug  + slug + :, e);
    notFound();
  }

  return (
    <BundleDetailPageClient 
      initialBundle={bundle} 
      initialReviews={reviews}
      relatedBundles={relatedBundles}
    />
  );
}
