import Joi from "joi";

const imageSchema = Joi.object({
  public_id: Joi.string().allow(""),
  url: Joi.string().allow(""),
  originalName: Joi.string().allow(""),
  mimeType: Joi.string().allow(""),
});

const colorSchema = Joi.object({
  name: Joi.string().trim().required(),

  hex: Joi.string()
    .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .allow("")
    .messages({ "string.pattern.base": "Invalid color hex code" }),
});

const specificationSchema = Joi.object({
  key: Joi.string().trim().required(),
  value: Joi.string().trim().required(),
});

const optionSchema = Joi.object({
  size: Joi.string().valid("XS", "S", "M", "L", "XL", "XXL").required(),
  stock: Joi.number().integer().min(0).required(),
  price: Joi.number().positive().required(),
  salePrice: Joi.number().min(0).allow(null),
});

const variantSchema = Joi.object({
  sku: Joi.string().trim().uppercase().min(3).max(50).required().messages({
    "string.empty": "SKU is required.",
    "string.min": "SKU must be at least 3 characters.",
    "string.max": "SKU cannot exceed 50 characters.",
    "any.required": "SKU is required.",
  }),

  color: colorSchema.required(),
  options: Joi.array().items(optionSchema).min(1).required().messages({
    "array.min": "Each variant must contain at least one size option.",
  }),
  images: Joi.array().items(imageSchema).default([]),
  isActive: Joi.boolean().default(true),
});

export const validateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(120).required(),
    description: Joi.string().trim().min(3).required(),
    category: Joi.string().hex().length(24).required(),
    brand: Joi.string().trim().allow(),
    suitableFor: Joi.array()
      .items(
        Joi.string().valid("men", "women", "unisex", "kids", "girls", "boys"),
      )
      .default([]),
    highlights: Joi.array().items(Joi.string()).default([]),
    tags: Joi.array().items(Joi.string()).default([]),
    specifications: Joi.array().items(specificationSchema).default([]),
    variants: Joi.array().items(variantSchema).min(1).required(),
    featured: Joi.boolean().default(false),
    bestSeller: Joi.boolean().default(false),
    latest: Joi.boolean().default(false),
    status: Joi.string().valid("draft", "published").default("published"),
    seo: Joi.object({
      metaTitle: Joi.string().allow(""),
      metaDescription: Joi.string().allow(""),
      keywords: Joi.array().items(Joi.string()).default([]),
    }).default({}),
  });

  return schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
};
