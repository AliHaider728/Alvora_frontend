import React, { useEffect } from 'react';
import { Product } from '../../types';
import { getEffectiveProductAvailability } from '../../utils/products';

interface SeoHeadProps {
  title?: string;
  description?: string;
  product?: Product;
  canonicalUrl?: string;
}

export const SeoHead: React.FC<SeoHeadProps> = ({ title, description, product, canonicalUrl }) => {
  const defaultTitle = "PlayBimboo - Premier Toy Store in Pakistan";
  const defaultDesc = "Shop original building sets, STEM robotics, action figures, plush toys, and board games in Pakistan with Cash on Delivery & Free Express Shipping.";

  const finalTitle = product?.metaTitle || (title ? `${title} | PlayBimboo` : defaultTitle);
  const finalDesc = description || product?.metaDescription || product?.shortDescription || product?.description || defaultDesc;
  const currentUrl = canonicalUrl || window.location.href;
  const imageUrl = product?.images[0] || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80';

  useEffect(() => {
    // Update Document Title
    document.title = finalTitle;

    // Helper to set meta tag
    const setMetaTag = (property: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attr}="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMetaTag('description', finalDesc);
    setMetaTag('og:title', finalTitle, true);
    setMetaTag('og:description', finalDesc, true);
    setMetaTag('og:url', currentUrl, true);
    setMetaTag('og:image', imageUrl, true);
    setMetaTag('og:type', product ? 'product' : 'website', true);
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', finalTitle);
    setMetaTag('twitter:description', finalDesc);
    setMetaTag('twitter:image', imageUrl);

    // Dynamic JSON-LD Product Schema for SEO
    if (product) {
      const existingSchema = document.getElementById('product-schema-jsonld');
      if (existingSchema) {
        existingSchema.remove();
      }

      const schemaData = {
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
        "offers": {
          "@type": "Offer",
          "url": currentUrl,
          "priceCurrency": "PKR",
          "price": product.price,
          "priceValidUntil": "2027-12-31",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": getEffectiveProductAvailability(product) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "seller": {
            "@type": "Organization",
            "name": "PlayBimboo"
          }
        },
        "aggregateRating": product.reviewCount > 0 ? {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
          "reviewCount": product.reviewCount
        } : undefined
      };

      const script = document.createElement('script');
      script.id = 'product-schema-jsonld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
    }
  }, [finalTitle, finalDesc, product, currentUrl, imageUrl]);

  return null;
};
