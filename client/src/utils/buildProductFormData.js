const buildProductFormData = (product) => {

  const variantsWithoutImages = product.variants.map((variant) => ({
    ...variant,
    images: [],
  }));

  const formData = new FormData();

  // Basic Information
  formData.append("name", product.name);
  formData.append("brand", product.brand);
  formData.append("description", product.description);
  formData.append("category", product.category);
  formData.append("bestSeller", product.bestSeller);
  formData.append("latest", product.latest);
  formData.append("status", product.status);

  // Arrays / Objects
  formData.append("suitableFor", JSON.stringify(product.suitableFor));
  formData.append("highlights", JSON.stringify(product.highlights));
  formData.append("tags", JSON.stringify(product.tags));
  formData.append("specifications", JSON.stringify(product.specifications));
  formData.append("seo", JSON.stringify(product.seo));
  formData.append("variants", JSON.stringify(variantsWithoutImages));

  // Featured Image
  if (product.featuredImage && product.featuredImage.length > 0) {
    formData.append("featuredImages", product.featuredImage[0]);
  }

  // Gallery Images
  if (product.productImages.length > 0) {
    product.productImages.forEach((image) => {
      formData.append("productImages", image);
    });
  }

  product.variants.forEach((variant, variantIndex) => {
    variant.images.forEach((image) => {
      formData.append(`variant_${variant._id}`, image);
    });
  });

  return formData;
};

export default buildProductFormData;
