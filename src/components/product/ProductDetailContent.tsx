import React from 'react';
import { Product } from '../../types';

export const ProductDetailContent: React.FC<{ product: Product }> = ({ product }) => {
  const blocks = (product.productDetailBlocks || [])
    .filter(block => block.enabled)
    .sort((a, b) => a.order - b.order);
  if (blocks.length === 0) return null;

  return (
    <section
      className="product-custom-content mb-12 space-y-8 overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8"
      data-product-slug={product.slug}
      aria-label="Additional product information"
    >
      {product.productDetailScopedCss && <style>{product.productDetailScopedCss}</style>}
      {blocks.map(block => {
        const width = block.settings?.width === 'medium' ? 'max-w-3xl' : block.settings?.width === 'large' ? 'max-w-5xl' : 'max-w-none';
        const alignment = block.settings?.alignment === 'left' ? 'mr-auto text-left' : block.settings?.alignment === 'right' ? 'ml-auto text-right' : 'mx-auto text-center';
        if (block.type === 'divider') return <hr key={block.id} className="border-slate-200" />;
        if (block.type === 'image' && block.image) return (
          <figure key={block.id} className={`${width} ${alignment}`}>
            <img src={block.image.secureUrl} alt={block.image.alt} loading="lazy" className="h-auto max-w-full rounded-2xl object-contain" />
            {block.image.caption && <figcaption className="mt-2 text-xs text-slate-500">{block.image.caption}</figcaption>}
          </figure>
        );
        return (
          <article key={block.id} className={`${width} ${alignment} overflow-x-auto`}>
            {block.heading && <h2 className="mb-3 font-heading text-2xl font-black text-slate-900">{block.heading}</h2>}
            <div
              className="space-y-3 text-sm leading-7 text-slate-700 [&_a]:text-sky-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-slate-200 [&_blockquote]:pl-4 [&_img]:h-auto [&_img]:max-w-full [&_ol]:list-decimal [&_ol]:pl-6 [&_table]:min-w-full [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: block.content || '' }}
            />
          </article>
        );
      })}
    </section>
  );
};
