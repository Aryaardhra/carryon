import generateSku from "./generateSku.js";

const generateVariantSKUs = (productName, variants) => {
  return variants.map((variant) => ({
    ...variant,
    sku:
      variant.sku?.trim() ||
      generateSku(
        productName,
        variant.color.name,
        variant.options[0].size
      ),
  }));
};

export default generateVariantSKUs;