import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getCategories } from "../services/categoryService";
import { getProductById, updateBasicInformation } from "../services/productService";

const initialProduct = {
  name: "",
  brand: "",
  description: "",
  category: "",

  featured: false,
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
        category: product.category?._id,

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

        // Cloudinary images
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

      await updateBasicInformation(id, {
        name: product.name,
        description: product.description,
        brand: product.brand,
        category: product.category,
        suitableFor: product.suitableFor,
        highlights: product.highlights,
        tags: product.tags,
        specifications: product.specifications,
        seo: product.seo,
        featured: product.featured,
        bestSeller: product.bestSeller,
        latest: product.latest,
        status: product.status,
      });

      toast.success("Product updated successfully.");

      navigate("/admin/products");
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
