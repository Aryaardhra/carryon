import logger from "../utils/logger.js";

const parseJSON = (value, defaultValue, fieldName) => {
  try {
    return JSON.parse(value ?? defaultValue);
  } catch {
    logger.warn(`Invalid ${fieldName} format.`);
    throw new Error(`Invalid ${fieldName} format.`);
  }
};

export const parseProductRequest = (body) => {
  const variants = parseJSON(body.variants, "[]", "variants");
  const specifications = parseJSON(body.specifications, "[]", "specifications");
  const tags = parseJSON(body.tags, "[]", "tags");
  const highlights = parseJSON(body.highlights, "[]", "highlights");
  const seo = parseJSON(body.seo, "{}", "seo");
  const suitableFor = parseJSON(body.suitableFor, "[]", "suitableFor");

  if (!Array.isArray(variants) || variants.length === 0) {
    logger.warn("Product has no variants.");
    throw new Error("At least one variant is required.");
  }

  return {
    ...body,

    bestSeller: body.bestSeller === "true" || body.bestSeller === true,

    latest: body.latest === "true" || body.latest === true,

    variants,
    specifications,
    tags,
    highlights,
    seo,
    suitableFor,
  };
};
export const parseUpdateProductRequest = (body) => {
  return {
    ...body,

    bestSeller:
      body.bestSeller !== undefined
        ? body.bestSeller === "true" || body.bestSeller === true
        : undefined,

    latest:
      body.latest !== undefined
        ? body.latest === "true" || body.latest === true
        : undefined,

    variants: body.variants
      ? parseJSON(body.variants, "[]", "variants")
      : undefined,

    specifications: body.specifications
      ? parseJSON(body.specifications, "[]", "specifications")
      : undefined,

    tags: body.tags ? parseJSON(body.tags, "[]", "tags") : undefined,

    highlights: body.highlights
      ? parseJSON(body.highlights, "[]", "highlights")
      : undefined,

    seo: body.seo ? parseJSON(body.seo, "{}", "seo") : undefined,

    suitableFor: body.suitableFor
      ? parseJSON(body.suitableFor, "[]", "suitableFor")
      : undefined,
  };
};
