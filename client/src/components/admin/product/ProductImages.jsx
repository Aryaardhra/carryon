import React, { useState } from "react";
import ImageUpload from "../ImageUpload";

const ProductImages = ({ product, setProduct }) => {
  const featuredFiles = Array.isArray(product.featuredImage)
    ? product.featuredImage
    : product.featuredImage
      ? [product.featuredImage]
      : [];

  const galleryFiles = Array.isArray(product.productImages)
    ? product.productImages
    : [];

  const setFeaturedImage = (files) => {
    setProduct((prev) => ({
      ...prev,
      featuredImage: files,
    }));
  };

  const setGalleryImages = (files) => {
    setProduct((prev) => ({
      ...prev,
      productImages: files,
    }));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-6">Product Images</h2>

      <div className="space-y-8">
        {/* Featured */}

        <div>
          <label className="block text-base font-medium mb-2">
            Featured Image
          </label>

          <ImageUpload
            idPrefix="featured"
            files={featuredFiles}
            setFiles={setFeaturedImage}
            maxImages={1}
          />
        </div>

        {/* Gallery */}

        <div>
          <label className="block text-base font-medium mb-2">
            Gallery Images
          </label>

          <ImageUpload
            idPrefix="gallery"
            files={galleryFiles}
            setFiles={setGalleryImages}
            maxImages={4}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductImages;
