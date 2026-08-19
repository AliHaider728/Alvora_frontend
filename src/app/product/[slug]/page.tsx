export const dynamic = 'force-dynamic';
import { ProductDetailPageClient } from "./ProductDetailPageClient";
import { api } from "../../../services/api";
import { getEffectiveProductAvailability } from "../../../utils/products";

import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const defaultTitle = "Alvora Skincare - Premium Skincare Products";
  const defaultDesc = "Shop premium skincare products in Pakistan with Cash on Delivery & Free Express Shipping.";

  try {
    const product = await api.getProduct(slug);
    if (!product) {
      console.error(`[generateMetadata] api.getProduct returned null for slug: ${slug}`);
      return { title: `${slug} | Alvora Skincare` };
    }

    const finalTitle = product.metaTitle || `${product.name} | Alvora Skincare`;
    const finalDesc = product.metaDescription || product.shortDescription || product.description || defaultDesc;
    const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80';
    
    return {
      title: finalTitle,
      description: finalDesc,
      alternates: {
        canonical: `https://alvora.pk/product/${slug}`
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
    return { title: `${slug} | Alvora Skincare` };
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  let schemaData = null;
  
  try {
    const product = await api.getProduct(slug);
    if (!product) {
      console.error(`[Page] api.getProduct returned null for slug: ${slug}`);
      notFound();
    }
    if (product) {
      schemaData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.images,
        "description": product.description,
        "sku": product.sku || product.id,
        "brand": {
          "@type": "Brand",
          "name": product.brand
        },
        "category": (product.categoryNames?.length ? product.categoryNames : [product.category]).filter(Boolean).join(', '),
        "offers": {
          "@type": "Offer",
          "priceCurrency": "PKR",
          "price": product.price,
          "priceValidUntil": "2027-12-31",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": getEffectiveProductAvailability(product) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "seller": {
            "@type": "Organization",
            "name": "Alvora Skincare"
          }
        }
      };
      if (product.reviewCount > 0) {
        schemaData.aggregateRating = {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
          "reviewCount": product.reviewCount
        };
      }
    }
  } catch (e) {
    console.error(`[Page] Error fetching product for slug ${slug}:`, e);
    notFound();
  }

  return (
    <>
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
      <ProductDetailPageClient />
    </>
  );
}
