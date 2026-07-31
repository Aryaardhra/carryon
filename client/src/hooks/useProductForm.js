import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCategories } from "../services/categoryService";
import { addProduct } from "../services/productService";
import buildProductFormData from "../utils/buildProductFormData";

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

  variants: [
    {
      tempId: crypto.randomUUID(),

      sku: "",

      color: {
        name: "",
        hex: "",
      },

      options: [
        {
          size: "",
          stock: 0,
          price: "",
          salePrice: "",
        },
      ],

      images: [],
      isActive: true,
    },
  ],
};

const useProductForm = () => {
  const [product, setProduct] = useState(initialProduct);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data?.categories || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to fetch categories.",
      );
    }
  };

  const resetForm = () => {
    setProduct(structuredClone(initialProduct));
  };

  const submitProduct = async (e) => {
  
    e.preventDefault();

    try {
      setLoading(true);
      const formData = buildProductFormData(product);
      const { data } = await addProduct(formData);
      toast.success(data.message);
      resetForm();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to add product.");
    } finally {
      setLoading(false);
    }
  };

  return {
    product,
    setProduct,
    categories,
    loading,
    submitProduct,
  };
};

export default useProductForm;
