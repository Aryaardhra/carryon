import {deleteFromCloudinary,uploadToCloudinary} from "../configs/cloudinary.js";
import logger from "./logger.js";

export const uploadFeaturedImage = async (
  files,
  uploadedPublicIds,
  required = true,
) => {
  const featuredFile = (files || []).find(
    (file) => file.fieldname === "featuredImages",
  );

  // No image uploaded
  if (!featuredFile) {
    if (required) {
      logger.warn("Featured image is required.");
      throw new Error("Featured image is required.");
    }

    // Update Product -> image not changed
    return null;
  }

  const result = await uploadToCloudinary(featuredFile);

  uploadedPublicIds.push(result.public_id);

  return {
    public_id: result.public_id,
    url: result.secure_url,
    originalName: featuredFile.originalname,
    mimeType: featuredFile.mimetype,
  };
};

export const uploadGalleryImages = async (
  files,
  uploadedPublicIds,
  required = true,
) => {
  const galleryFiles = (files || []).filter(
    (file) => file.fieldname === "productImages",
  );

  if (!galleryFiles.length) {
    if (required) {
      throw new Error("Product images are required.");
    }

    return [];
  }

  const productImages = await Promise.all(
    galleryFiles.map(async (file) => {
      const result = await uploadToCloudinary(file);

      uploadedPublicIds.push(result.public_id);

      return {
        public_id: result.public_id,
        url: result.secure_url,
        originalName: file.originalname,
        mimeType: file.mimetype,
      };
    }),
  );

  return productImages;
};

export const uploadVariantImages = async (
  files,
  variants,
  uploadedPublicIds,
) => {
  const finalVariants = [];

  for (const variant of variants) {
    const variantFiles = (files || []).filter(
      (file) => file.fieldname === `variant_${variant.sku}`,
    );

    if (!variantFiles.length) {
      logger.warn(`No images uploaded for variant ${variant.sku}`);

      throw new Error(
        `Please upload at least one image for variant ${variant.sku}`,
      );
    }

    const variantImages = await Promise.all(
      variantFiles.map(async (file) => {
        const result = await uploadToCloudinary(file);

        uploadedPublicIds.push(result.public_id);

        return {
          public_id: result.public_id,
          url: result.secure_url,
          originalName: file.originalname,
          mimeType: file.mimetype,
        };
      }),
    );

    finalVariants.push({
      sku: variant.sku.trim().toUpperCase(),

      color: variant.color,

      options: variant.options.map((option) => ({
        size: option.size,
        stock: Number(option.stock),
        price: Number(option.price),
        salePrice:
          option.salePrice === "" || option.salePrice == null
            ? null
            : Number(option.salePrice),
      })),

      images: variantImages,

      isActive: variant.isActive ?? true,
    });
  }

  return finalVariants;
};

export const replaceFeaturedImage = async (
  product,
  files,
  uploadedPublicIds,
) => {
  const featuredFile = (files || []).find(
    (file) => file.fieldname === "featuredImage",
  );

  if (!featuredFile) {
    throw new Error("Featured image is required.");
  }

  // Delete old image

  if (product.featuredImage?.public_id) {
    await deleteFromCloudinary(product.featuredImage.public_id);
  }

  // Upload new image

  const result = await uploadToCloudinary(featuredFile);

  uploadedPublicIds.push(result.public_id);

  product.featuredImage = {
    public_id: result.public_id,
    url: result.secure_url,
    originalName: featuredFile.originalname,
    mimeType: featuredFile.mimetype,
  };
};

export const replaceGalleryImages = async (
  product,
  files,
  uploadedPublicIds,
) => {
  const galleryFiles = (files || []).filter(
    (file) => file.fieldname === "galleryImages",
  );

  if (!galleryFiles.length) {
    throw new Error("Gallery images are required.");
  }

  // Delete old gallery

  if (product.productImages.length) {
    await Promise.all(
      product.productImages.map((image) =>
        deleteFromCloudinary(image.public_id),
      ),
    );
  }

  //Upload new gallery

  const galleryImages = await Promise.all(
    galleryFiles.map(async (file) => {
      const result = await uploadToCloudinary(file);
      uploadedPublicIds.push(result.public_id);

      return {
        public_id: result.public_id,
        url: result.secure_url,
        originalName: file.originalname,
        mimeType: file.mimetype,
      };
    }),
  );

  product.productImages = galleryImages;
};

export const replaceVariantImages = async (
  files,
  variant,
  uploadedPublicIds,
) => {
  if (!files.length) {
    throw new Error("Please upload images.");
  }

  //Delete old images

  if (variant.images.length) {
    await Promise.all(
      variant.images.map((image) => deleteFromCloudinary(image.public_id)),
    );
  }

  //Upload new images

  const uploadedImages = await Promise.all(
    files.map(async (file) => {
      const result = await uploadToCloudinary(file);
      uploadedPublicIds.push(result.public_id);

      return {
        public_id: result.public_id,
        url: result.secure_url,
        originalName: file.originalname,
        mimeType: file.mimetype,
      };
    }),
  );

  return uploadedImages;
};
