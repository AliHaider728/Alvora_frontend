export const revalidate = 60; // Enable ISR

import { api } from "../../../services/api";
import { BundleDetailPageClient } from "./BundleDetailPageClient";
import { notFound } from "next/navigation";
import { getBundleImages } from "../../../utils/bundleImages";
import { getCartImageProps, getThumbnailSource } from "../../../utils/cartImages";
import { getSafeImageSrc } from "../../../utils/images";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const defaultDesc = "Shop premium skincare bundles in Pakistan with Cash on Delivery & Free Express Shipping.";

  try {
    const bundle = await api.getBundle(slug);
    if (!bundle) {
      return { title: `Bundle ` };
    }

    const finalTitle = `${bundle.name}  Bundles`;
    const finalDesc = bundle.description || defaultDesc;
    const imageUrl = bundle.image || '/images/hero/alvora-hero.png';
    
    return {
      title: finalTitle,
      description: finalDesc,
      alternates: {
        canonical: `https://alvora.pk/bundles/${slug}`
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
    return { title: `Bundle ` };
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  
  let bundle: any = null;
  let reviews: any[] = [];
  let relatedBundles: any[] = [];
  
  try {
    const [fetchedBundle, fetchedRelated] = await Promise.all([
      api.getBundle(slug),
      api.getBundles().catch(() => ({ bundles: [] }))
    ]);

    bundle = fetchedBundle;
    const bundleList = Array.isArray(fetchedRelated?.bundles) ? fetchedRelated.bundles : [];
    relatedBundles = bundleList.filter((b: any) => b.slug !== slug).slice(0, 4);

    if (!bundle) {
      notFound();
    }
    
    // Fetch reviews using bundle.id (bundles have their own reviews)
    const reviewResult = await api.getProductReviews(bundle.id).catch(() => []);
    reviews = Array.isArray(reviewResult) ? reviewResult : [];

  } catch (e) {
    console.error(`[Page] Error fetching bundle for slug ${slug}:`, e);
    notFound();
  }

  const bundleImage = getBundleImages(bundle)[0];
  const cartImage = bundleImage
    ? getCartImageProps(getSafeImageSrc(getThumbnailSource(bundleImage)))
    : null;

  return (
    <>
      {cartImage && <link rel="preload" as="image" imageSrcSet={cartImage.srcSet} imageSizes={cartImage.sizes} fetchPriority="low" />}
      <BundleDetailPageClient
        initialBundle={bundle}
        initialReviews={reviews}
        relatedBundles={relatedBundles}
      />
    </>
  );
}
