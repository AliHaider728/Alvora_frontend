import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  Tag,
  Trash2,
  UploadCloud
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { SeoHead } from '../../components/common/SeoHead';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { AGE_GROUPS } from '../../data/mockData';
import { api } from '../../services/api';
import {
  AgeGroupCategory,
  DeliveryChargeType,
  Product,
  ProductVariantGroup,
  ProductVariantOption
} from '../../types';
import { getSafeImageSrc } from '../../utils/images';

type VariantDraft = {
  name: string;
  priceOffset: number;
  inStock: boolean;
};

type OrderedImage = {
  id: string;
  url: string;
};

const fieldClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100';

const makeImage = (url: string, suffix = ''): OrderedImage => ({
  id: `${url}-${suffix || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`,
  url
});

const FormSection: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-7">
    <div className="mb-5 border-b border-slate-100 pb-4">
      <h2 className="font-heading text-lg font-black text-slate-900">{title}</h2>
      <p className="mt-1 text-xs font-medium text-slate-500">{description}</p>
    </div>
    {children}
  </section>
);

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, categories, addProduct, updateProduct } = useStore();
  const { showToast } = useToast();
  const initializedProductId = useRef<string | null>(null);

  const productFromStore = id ? products.find(product => product.id === id) : undefined;
  const [fetchedProduct, setFetchedProduct] = useState<Product | undefined>();
  const [productLoadFailed, setProductLoadFailed] = useState(false);
  const editingProduct = productFromStore || fetchedProduct;
  const isEditing = Boolean(id);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(2999);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(3499);
  const [category, setCategory] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroupCategory>('6-8');
  const [brand, setBrand] = useState('PlayBimboo Studios');
  const [stockQuantity, setStockQuantity] = useState(25);
  const [images, setImages] = useState<OrderedImage[]>([]);
  const [description, setDescription] = useState(
    'Fun and engaging toy designed for hours of creative play.'
  );
  const [isVisible, setIsVisible] = useState(true);
  const [deliveryType, setDeliveryType] = useState<DeliveryChargeType>('store_threshold');
  const [customDeliveryFee, setCustomDeliveryFee] = useState<number | undefined>();
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [variants, setVariants] = useState<ProductVariantGroup[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newOptionInputs, setNewOptionInputs] = useState<Record<number, VariantDraft>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id || productFromStore || fetchedProduct || productLoadFailed) return;

    let isCurrent = true;
    api.getProduct(id).then(result => {
      if (!isCurrent) return;
      if (!result) {
        setProductLoadFailed(true);
        return;
      }

      setFetchedProduct({
        ...(result as Product),
        id: String(result.id || result._id || id),
        images: Array.isArray(result.images)
          ? result.images.filter((image: unknown): image is string =>
              typeof image === 'string' && image.trim().length > 0
            )
          : []
      });
    });

    return () => {
      isCurrent = false;
    };
  }, [fetchedProduct, id, productFromStore, productLoadFailed]);

  useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0].name);
      setCategorySlug(categories[0].slug);
    }
  }, [categories, category]);

  useEffect(() => {
    if (!editingProduct || initializedProductId.current === editingProduct.id) return;

    initializedProductId.current = editingProduct.id;
    setName(editingProduct.name);
    setPrice(editingProduct.price);
    setOriginalPrice(editingProduct.originalPrice);
    setCategory(editingProduct.category);
    setCategorySlug(editingProduct.categorySlug);
    setAgeGroup(editingProduct.ageGroup);
    setBrand(editingProduct.brand);
    setStockQuantity(editingProduct.stockQuantity);
    setImages((editingProduct.images || []).map((url, index) => makeImage(url, String(index))));
    setDescription(editingProduct.description);
    setIsVisible(editingProduct.isVisible !== false);
    setDeliveryType(editingProduct.deliveryType || 'store_threshold');
    setCustomDeliveryFee(editingProduct.customDeliveryFee);
    setMetaTitle(editingProduct.metaTitle || '');
    setMetaDescription(editingProduct.metaDescription || '');
    setVariants(
      editingProduct.variants
        ? editingProduct.variants.map(group => ({
            ...group,
            options: group.options.map(option => ({ ...option }))
          }))
        : []
    );
  }, [editingProduct]);

  const handleAddVariantGroup = () => {
    const groupName = newGroupName.trim();
    if (!groupName) {
      showToast('Enter a variant group name first.', 'error');
      return;
    }

    setVariants(current => [
      ...current,
      { id: `g-${Date.now()}`, name: groupName, options: [] }
    ]);
    setNewGroupName('');
    showToast(`Added ${groupName} variant group.`, 'success');
  };

  const handleRemoveVariantGroup = (groupIndex: number) => {
    const groupName = variants[groupIndex]?.name || 'Variant';
    setVariants(current => current.filter((_, index) => index !== groupIndex));
    showToast(`Removed ${groupName} variant group.`, 'info');
  };

  const handleAddOptionToGroup = (groupIndex: number) => {
    const input = newOptionInputs[groupIndex];
    const optionName = input?.name.trim();
    if (!optionName) {
      showToast('Enter an option name first.', 'error');
      return;
    }

    if (variants[groupIndex]?.options.some(option => option.name === optionName)) {
      showToast(`${optionName} already exists in this group.`, 'error');
      return;
    }

    const newOption: ProductVariantOption = {
      id: `v-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: optionName,
      priceOffset: input.priceOffset || 0,
      inStock: input.inStock
    };

    setVariants(current =>
      current.map((group, index) =>
        index === groupIndex ? { ...group, options: [...group.options, newOption] } : group
      )
    );
    setNewOptionInputs(current => ({
      ...current,
      [groupIndex]: { name: '', priceOffset: 0, inStock: true }
    }));
    showToast(`Added ${optionName} option.`, 'success');
  };

  const handleRemoveOption = (groupIndex: number, optionId: string) => {
    setVariants(current =>
      current.map((group, index) =>
        index === groupIndex
          ? { ...group, options: group.options.filter(option => option.id !== optionId) }
          : group
      )
    );
    showToast('Removed variant option.', 'info');
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length || fromIndex === toIndex) return;

    setImages(current => {
      const reordered = [...current];
      const [movedImage] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, movedImage);
      return reordered;
    });
    showToast(toIndex === 0 ? 'Main thumbnail updated.' : 'Image order updated.', 'success');
  };

  const removeImage = (imageId: string) => {
    const imageIndex = images.findIndex(image => image.id === imageId);
    setImages(current => current.filter(image => image.id !== imageId));
    showToast(
      imageIndex === 0
        ? 'Main thumbnail removed. The next image is now the thumbnail.'
        : 'Gallery image removed.',
      'info'
    );
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadedImages: OrderedImage[] = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        showToast(`${file.name} is too large. Maximum size is 5MB.`, 'error');
        continue;
      }

      const result = await api.uploadImage(file);
      if (result?.url) {
        uploadedImages.push(makeImage(result.url));
      } else {
        showToast(`Could not upload ${file.name}. Check the upload service configuration.`, 'error');
      }
    }

    if (uploadedImages.length > 0) {
      setImages(current => [...current, ...uploadedImages]);
      showToast(
        `${uploadedImages.length} image${uploadedImages.length === 1 ? '' : 's'} uploaded.`,
        'success'
      );
    }
    setIsUploading(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedBrand = brand.trim();
    const trimmedDescription = description.trim();
    if (!trimmedName || !trimmedBrand || !trimmedDescription || !category) {
      showToast('Complete all required product fields before saving.', 'error');
      return;
    }
    if (price < 0 || stockQuantity < 0) {
      showToast('Price and stock cannot be negative.', 'error');
      return;
    }
    if (deliveryType === 'fixed' && (customDeliveryFee === undefined || customDeliveryFee < 0)) {
      showToast('Enter a valid fixed delivery fee.', 'error');
      return;
    }

    const selectedCategory = categories.find(item => item.name === category);
    const resolvedCategorySlug = selectedCategory?.slug || categorySlug;
    const slug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const productPayload: Omit<Product, 'id'> = {
      name: trimmedName,
      slug,
      price: Number(price),
      originalPrice: originalPrice === undefined ? undefined : Number(originalPrice),
      discountPercent:
        originalPrice && originalPrice > price
          ? Math.round(((originalPrice - price) / originalPrice) * 100)
          : 0,
      rating: editingProduct?.rating ?? 5,
      reviewCount: editingProduct?.reviewCount ?? 0,
      category,
      categorySlug: resolvedCategorySlug,
      ageGroup,
      brand: trimmedBrand,
      inStock: Number(stockQuantity) > 0,
      stockQuantity: Number(stockQuantity),
      images: images.map(image => image.url),
      description: trimmedDescription,
      isVisible,
      deliveryType,
      customDeliveryFee: deliveryType === 'fixed' ? customDeliveryFee : undefined,
      variants,
      features: editingProduct?.features || [
        'Durable BPA-free plastic construction',
        'Encourages imaginative play'
      ],
      safetyInfo: editingProduct?.safetyInfo || 'Non-toxic child safe materials.',
      specifications: editingProduct?.specifications || { Material: 'ABS Plastic' },
      isFeatured: editingProduct?.isFeatured,
      isNewArrival: editingProduct?.isNewArrival,
      isBestseller: editingProduct?.isBestseller,
      tags: editingProduct?.tags?.length
        ? editingProduct.tags
        : ['toy', resolvedCategorySlug].filter(Boolean),
      metaTitle: metaTitle.trim() || `${trimmedName} - PlayBimboo`,
      metaDescription: metaDescription.trim() || trimmedDescription.slice(0, 150)
    };

    setIsSaving(true);
    const savedProduct = id
      ? await updateProduct(id, productPayload)
      : await addProduct(productPayload);
    setIsSaving(false);

    if (!savedProduct) {
      showToast(`Could not ${isEditing ? 'update' : 'add'} the product. Please try again.`, 'error');
      return;
    }

    showToast(
      `${isEditing ? 'Updated' : 'Added'} product ${savedProduct.name}.`,
      'success'
    );
    navigate('/admin/products');
  };

  if (isEditing && productLoadFailed) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-slate-200 bg-white p-6">
        <div className="text-center">
          <ImageIcon className="mx-auto h-8 w-8 text-slate-300" />
          <h1 className="mt-3 font-heading text-lg font-black text-slate-900">Product not found</h1>
          <p className="mt-1 text-xs font-medium text-slate-500">
            This product may have been removed or the edit link is invalid.
          </p>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (isEditing && !editingProduct) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-slate-200 bg-white">
        <div className="text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-rose-500" />
          <p className="mt-3 text-sm font-bold text-slate-600">Loading product details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10 font-sans">
      <SeoHead title={isEditing ? 'Edit Product' : 'Add Product'} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-slate-500 transition hover:text-rose-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </button>
          <h1 className="font-heading text-2xl font-black text-slate-900 sm:text-3xl">
            {isEditing ? 'Edit Toy Product' : 'Add New Toy Product'}
          </h1>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {isEditing
              ? 'Update product details, image order, variants, delivery, and search metadata.'
              : 'Create a complete product listing for the PlayBimboo storefront.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection title="Basic Info" description="Core storefront information and publishing status.">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="mb-1.5 block text-xs font-bold text-slate-700">Product Name *</span>
              <input
                type="text"
                required
                value={name}
                onChange={event => setName(event.target.value)}
                className={fieldClassName}
              />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-bold text-slate-700">Brand Name *</span>
              <input
                type="text"
                required
                value={brand}
                onChange={event => setBrand(event.target.value)}
                className={fieldClassName}
              />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-bold text-slate-700">Storefront Visibility</span>
              <select
                value={isVisible ? 'true' : 'false'}
                onChange={event => setIsVisible(event.target.value === 'true')}
                className={fieldClassName}
              >
                <option value="true">Visible to Customers</option>
                <option value="false">Hidden / Draft</option>
              </select>
            </label>
            <label className="sm:col-span-2">
              <span className="mb-1.5 block text-xs font-bold text-slate-700">Description *</span>
              <textarea
                rows={5}
                required
                value={description}
                onChange={event => setDescription(event.target.value)}
                className={fieldClassName}
              />
            </label>
          </div>
        </FormSection>

        <FormSection
          title="Images"
          description="The first image is always the main product thumbnail. Reorder or remove images before saving."
        >
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-rose-600">
                Main Thumbnail
              </h3>
              {images[0] ? (
                <div className="grid max-w-xl gap-4 rounded-2xl border-2 border-rose-200 bg-rose-50/40 p-4 sm:grid-cols-[160px_1fr]">
                  <img
                    src={getSafeImageSrc(images[0].url)}
                    alt={`${name || 'Product'} main thumbnail`}
                    className="aspect-square w-full rounded-xl bg-white object-cover"
                  />
                  <div className="flex flex-col justify-between gap-4">
                    <div>
                      <span className="inline-flex rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                        Storefront Thumbnail
                      </span>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        This image appears first on product cards and product detail pages.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={images.length < 2}
                        onClick={() => moveImage(0, 1)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ArrowRight className="h-3.5 w-3.5" /> Move to Gallery
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(images[0].id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex max-w-xl items-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 p-5 text-slate-500">
                  <ImageIcon className="h-7 w-7" />
                  <p className="text-xs font-semibold">Upload an image to create the main thumbnail.</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-slate-600">
                Additional Gallery Images
              </h3>
              {images.length > 1 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {images.slice(1).map((image, galleryIndex) => {
                    const imageIndex = galleryIndex + 1;
                    return (
                      <article key={image.id} className="rounded-2xl border border-slate-200 p-3">
                        <img
                          src={getSafeImageSrc(image.url)}
                          alt={`${name || 'Product'} gallery ${imageIndex}`}
                          className="aspect-video w-full rounded-xl bg-slate-100 object-cover"
                        />
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => moveImage(imageIndex, 0)}
                            className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-[11px] font-bold text-rose-600"
                          >
                            Make Thumbnail
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(imageIndex, imageIndex - 1)}
                            aria-label={`Move gallery image ${imageIndex} left`}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600"
                          >
                            <ArrowLeft className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={imageIndex === images.length - 1}
                            onClick={() => moveImage(imageIndex, imageIndex + 1)}
                            aria-label={`Move gallery image ${imageIndex} right`}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            aria-label={`Remove gallery image ${imageIndex}`}
                            className="ml-auto rounded-lg border border-rose-200 p-1.5 text-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs font-medium text-slate-400">No additional gallery images yet.</p>
              )}
            </div>

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200">
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
              ) : (
                <UploadCloud className="h-4 w-4" />
              )}
              <span>{isUploading ? 'Uploading…' : 'Upload Images (Max 5MB each)'}</span>
              <input
                type="file"
                multiple
                disabled={isUploading}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </FormSection>

        <FormSection title="Category & Age" description="Choose where customers discover this product.">
          <div className="grid gap-5 sm:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-xs font-bold text-slate-700">Category *</span>
              <select
                required
                value={category}
                onChange={event => {
                  setCategory(event.target.value);
                  const selected = categories.find(item => item.name === event.target.value);
                  if (selected) setCategorySlug(selected.slug);
                }}
                className={fieldClassName}
              >
                {categories.map(item => (
                  <option key={item.id || item.slug} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-bold text-slate-700">Age Recommendation</span>
              <select
                value={ageGroup}
                onChange={event => setAgeGroup(event.target.value as AgeGroupCategory)}
                className={fieldClassName}
              >
                {AGE_GROUPS.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </FormSection>

        <FormSection title="Pricing & Stock" description="Set PKR pricing and available inventory.">
          <div className="grid gap-5 sm:grid-cols-3">
            <label>
              <span className="mb-1.5 block text-xs font-bold text-slate-700">Price (Rs.) *</span>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={price}
                onChange={event => setPrice(Number(event.target.value))}
                className={fieldClassName}
              />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-bold text-slate-700">Original Price (Rs.)</span>
              <input
                type="number"
                min="0"
                step="1"
                value={originalPrice ?? ''}
                onChange={event =>
                  setOriginalPrice(event.target.value ? Number(event.target.value) : undefined)
                }
                className={fieldClassName}
              />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-bold text-slate-700">Stock Quantity *</span>
              <input
                type="number"
                min="0"
                required
                value={stockQuantity}
                onChange={event => setStockQuantity(Number(event.target.value))}
                className={fieldClassName}
              />
            </label>
          </div>
        </FormSection>

        <FormSection title="Variants" description="Add optional groups such as Color, Size, or Pack.">
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                placeholder="Variant group name (e.g. Color)"
                value={newGroupName}
                onChange={event => setNewGroupName(event.target.value)}
                className={fieldClassName}
              />
              <button
                type="button"
                onClick={handleAddVariantGroup}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white"
              >
                <Plus className="h-4 w-4" /> Add Group
              </button>
            </div>

            {variants.length === 0 && (
              <p className="rounded-xl bg-slate-50 p-4 text-xs font-medium text-slate-500">
                No variants configured. Customers will purchase the standard product.
              </p>
            )}

            {variants.map((group, groupIndex) => (
              <div key={group.id || group.name} className="space-y-3 rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-600">
                    <Tag className="h-4 w-4" /> {group.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariantGroup(groupIndex)}
                    className="text-xs font-bold text-rose-600"
                  >
                    Remove Group
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.options.map(option => (
                    <span
                      key={option.id || `${group.id}-${option.name}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700"
                    >
                      {option.name}
                      {option.priceOffset ? ` (+Rs. ${option.priceOffset})` : ''}
                      {!option.inStock ? ' — Out of stock' : ''}
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(groupIndex, option.id)}
                        aria-label={`Remove ${option.name}`}
                        className="text-rose-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="grid gap-2 border-t border-slate-100 pt-3 sm:grid-cols-[1fr_120px_auto_auto] sm:items-center">
                  <input
                    type="text"
                    placeholder={`${group.name} option`}
                    value={newOptionInputs[groupIndex]?.name || ''}
                    onChange={event =>
                      setNewOptionInputs(current => ({
                        ...current,
                        [groupIndex]: {
                          ...(current[groupIndex] || { priceOffset: 0, inStock: true }),
                          name: event.target.value
                        }
                      }))
                    }
                    className={fieldClassName}
                  />
                  <input
                    type="number"
                    placeholder="+Rs."
                    value={newOptionInputs[groupIndex]?.priceOffset || ''}
                    onChange={event =>
                      setNewOptionInputs(current => ({
                        ...current,
                        [groupIndex]: {
                          ...(current[groupIndex] || { name: '', inStock: true }),
                          priceOffset: Number(event.target.value)
                        }
                      }))
                    }
                    className={fieldClassName}
                  />
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <input
                      type="checkbox"
                      checked={newOptionInputs[groupIndex]?.inStock ?? true}
                      onChange={event =>
                        setNewOptionInputs(current => ({
                          ...current,
                          [groupIndex]: {
                            ...(current[groupIndex] || { name: '', priceOffset: 0 }),
                            inStock: event.target.checked
                          }
                        }))
                      }
                    />
                    In Stock
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddOptionToGroup(groupIndex)}
                    className="rounded-xl bg-rose-500 px-4 py-2.5 text-xs font-bold text-white"
                  >
                    Add Option
                  </button>
                </div>
              </div>
            ))}
          </div>
        </FormSection>

        <FormSection title="Delivery Charges" description="Choose how delivery is calculated for this product.">
          <div className="grid gap-5 sm:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-xs font-bold text-slate-700">Delivery Charge Model</span>
              <select
                value={deliveryType}
                onChange={event => setDeliveryType(event.target.value as DeliveryChargeType)}
                className={fieldClassName}
              >
                <option value="store_threshold">Default Store Shipping Fee</option>
                <option value="category">Category-Based Charge</option>
                <option value="fixed">Fixed Custom Fee</option>
                <option value="free">Always Free Delivery</option>
              </select>
            </label>
            {deliveryType === 'fixed' && (
              <label>
                <span className="mb-1.5 block text-xs font-bold text-slate-700">Custom Delivery Fee (Rs.) *</span>
                <input
                  type="number"
                  min="0"
                  required
                  value={customDeliveryFee ?? ''}
                  onChange={event =>
                    setCustomDeliveryFee(event.target.value ? Number(event.target.value) : undefined)
                  }
                  className={fieldClassName}
                />
              </label>
            )}
          </div>
        </FormSection>

        <FormSection title="SEO" description="Optional search title and description for this product page.">
          <div className="grid gap-5">
            <label>
              <span className="mb-1.5 block text-xs font-bold text-slate-700">SEO Meta Title</span>
              <input
                type="text"
                value={metaTitle}
                onChange={event => setMetaTitle(event.target.value)}
                placeholder={name ? `${name} - PlayBimboo` : 'Product title for search results'}
                className={fieldClassName}
              />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-bold text-slate-700">SEO Meta Description</span>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={event => setMetaDescription(event.target.value)}
                placeholder="Short product summary for search results"
                className={fieldClassName}
              />
            </label>
          </div>
        </FormSection>

        <div className="sticky bottom-4 z-10 flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-sm sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => navigate('/admin/products')}
            className="rounded-xl bg-slate-100 px-5 py-3 text-xs font-bold text-slate-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? 'Saving…' : 'Save Toy Product'}
          </button>
        </div>
      </form>
    </div>
  );
};
