import { useParams } from "react-router-dom";
import useEditProduct from "../../hooks/useEditProduct";
import AdminHeader from "./AdminHeader";
import AdminCard from "../../components/admin/AdminCard";
import BasicInformation from "../../components/admin/product/BasicInformation";
import ProductImages from "../../components/admin/product/ProductImages";
import ProductVariants from "../../components/admin/product/ProductVariants";
import ProductSpecifications from "../../components/admin/product/ProductSpecifications";
import ProductAttributes from "../../components/admin/product/ProductAttributes";
import SeoSection from "../../components/admin/product/SeoSection";
import AdminButton from "../../components/admin/AdminButton";
import ProductVisibility from "../../components/admin/product/ProductVisibility";
import ProductAnalytics from "../../components/admin/product/ProductAnalytics";

const EditProduct = () => {

  const {
    product,
    setProduct,
    categories,
    loading,
    submitProduct,
    pageLoading,
  } = useEditProduct();

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading Product...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">

      <AdminHeader title="Edit Product" />

      <form onSubmit={submitProduct}>

        <AdminCard>

          <div className="space-y-10">

            {/* Basic Information */}

            <section>

              <h2 className="text-lg font-semibold mb-5">
                Basic Information
              </h2>

              <BasicInformation
                product={product}
                setProduct={setProduct}
                categories={categories}
              />

            </section>

            {/* Images */}

            <section>

              <h2 className="text-lg font-semibold mb-5">
                Product Images
              </h2>

              <ProductImages
                product={product}
                setProduct={setProduct}
              />

            </section>

            {/* Variants */}

            <section>

              <ProductVariants
                product={product}
                setProduct={setProduct}
              />

            </section>

            {/* Specifications */}

            <section>

              <ProductSpecifications
                product={product}
                setProduct={setProduct}
              />

            </section>

            {/* Attributes */}

            <section>

              <h2 className="text-lg font-semibold mb-5">
                Product Attributes
              </h2>

              <ProductAttributes
                product={product}
                setProduct={setProduct}
              />

            </section>

            {/* Visibility */}

            <section>

              <ProductVisibility
                product={product}
                setProduct={setProduct}
              />

            </section>

            {/* SEO */}

            <section>

              <SeoSection
                product={product}
                setProduct={setProduct}
              />

            </section>

            <div className="flex justify-end">

              <AdminButton loading={loading}>
                Save Changes
              </AdminButton>

            </div>

          </div>

        </AdminCard>

      </form>

    </div>
  );
};

export default EditProduct;
