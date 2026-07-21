import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getCategories } from "../services/categoryService";
import {
  getProductById,
  updateBasicInformation,
  updateFeaturedImage,
  updateGalleryImages,
  updateProductInventory,
  updateProductPricing,
  updateVariantBasic,
  updateVariantImages,
} from "../services/productService";

const initialProduct = {
  name: "",
  brand: "",
  description: "",
  category: "",

  bestSeller: false,
  latest: false,

  status: "published",

  suitableFor: [],
  highlights: [],
  tags: [],
  specifications: [],

  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: [],
  },

  featuredImage: [],
  productImages: [],

  variants: [],
};

const useEditProduct = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] = useState(initialProduct);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const updateFeaturedIfNeeded = async () => {
    const file = product.featuredImage?.[0];
    if (!(file instanceof File)) return;
    const formData = new FormData();
    formData.append("featuredImage", file);
    await updateFeaturedImage(id, formData);
  };

  const updateGalleryIfNeeded = async () => {
    const newImages = product.productImages.filter(
      (image) => image instanceof File,
    );

    if (!newImages.length) return;

    const formData = new FormData();

    newImages.forEach((image) => {
      formData.append("galleryImages", image);
    });

    await updateGalleryImages(id, formData);
  };

  const updateVariantImagesIfNeeded = async () => {
    for (const variant of product.variants) {
      const newImages = variant.images.filter((image) => image instanceof File);

      if (!newImages.length) continue;

      const formData = new FormData();

      formData.append("variantId", variant._id);

      newImages.forEach((image) => {
        formData.append("images", image);
      });

      await updateVariantImages(id, formData);
    }
  };
  const updatePricingIfNeeded = async () => {
    await updateProductPricing(id, {
      variants: product.variants,
    });
  };

  const updateInventoryIfNeeded = async () => {
    await updateProductInventory(id, {
      variants: product.variants,
    });
  };

  useEffect(() => {
    loadPage();
  }, [id]);

  const loadPage = async () => {
    try {
      setPageLoading(true);

      const [{ data: categoryData }, { data: productData }] = await Promise.all(
        [getCategories(), getProductById(id)],
      );

      setCategories(categoryData.categories);

      const product = productData.product;

      setProduct({
        name: product.name,
        brand: product.brand,
        description: product.description,
        category: product.category?._id || "",

        bestSeller: product.bestSeller,
        latest: product.latest,

        status: product.status,

        suitableFor: product.suitableFor || [],
        highlights: product.highlights || [],
        tags: product.tags || [],
        specifications: product.specifications || [],

        seo: product.seo || {
          metaTitle: "",
          metaDescription: "",
          keywords: [],
        },

        featuredImage: product.featuredImage ? [product.featuredImage] : [],

        productImages: product.productImages || [],

        variants: product.variants || [],
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load product.");
    } finally {
      setPageLoading(false);
    }
  };

  const submitProduct = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Basic Information
      await updateBasicInformation(id, {
        name: product.name,
        brand: product.brand,
        description: product.description,
        category: product.category,

        suitableFor: product.suitableFor,
        highlights: product.highlights,
        tags: product.tags,
        specifications: product.specifications,

        seo: product.seo,

        bestSeller: product.bestSeller,
        latest: product.latest,
        status: product.status,
      });

      await updateVariantBasic(id, {
        productName: product.name,
        variants: product.variants.map((variant) => ({
           _id: variant._id,
          color: variant.color,
        })),
      });

      // Pricing
      await updatePricingIfNeeded();

      // Inventory
      await updateInventoryIfNeeded();

      // Images
      await updateFeaturedIfNeeded();
      await updateGalleryIfNeeded();
      await updateVariantImagesIfNeeded();

      toast.success("Product updated successfully.");

      navigate("/admin/product-list");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update product.");
    } finally {
      setLoading(false);
    }
  };

  return {
    product,
    setProduct,

    categories,

    loading,
    pageLoading,

    submitProduct,
  };
};

export default useEditProduct;
