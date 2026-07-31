import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      default: "",
    },

    url: {
      type: String,
      default: "",
    },

    originalName: {
      type: String,
      default: "",
    },

    mimeType: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  },
);

const colorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    hex: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const specificationSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);
const optionSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    salePrice: {
      type: Number,
      default: null,
      min: 0,
    },
  },
  { _id: false },
);

const variantSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    color: {
      type: colorSchema,
      required: true,
    },

    options: {
      type: [optionSchema],
      required: true,
      validate: {
        validator(value) {
          return value.length > 0;
        },
        message: "Each variant must contain at least one size option.",
      },
    },

    images: {
      type: [imageSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
);

variantSchema.set("toJSON", {
  virtuals: true,
});

variantSchema.set("toObject", {
  virtuals: true,
});

const seoSchema = new mongoose.Schema(
  {
    metaTitle: {
      type: String,
      default: "",
      trim: true,
    },

    metaDescription: {
      type: String,
      default: "",
      trim: true,
    },

    keywords: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    brand: {
      type: String,
      default: "",
      trim: true,
    },

    featuredImage: {
      type: imageSchema,
      default: {},
    },

    productImages: {
      type: [imageSchema],
      default: [],
    },

    specifications: {
      type: [specificationSchema],
      default: [],
    },

    suitableFor: [
      {
        type: String,
        enum: ["men", "women", "unisex", "kids", "girls", "boys"],
      },
    ],

    highlights: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    variants: {
      type: [variantSchema],
      required: true,
      validate: {
        validator(value) {
          return value.length > 0;
        },
        message: "Product must have at least one variant.",
      },
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    bestSeller: {
      type: Boolean,
      default: false,
    },

    latest: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    seo: {
      type: seoSchema,
      default: {},
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({
  name: "text",
  description: "text",
  tags: "text",
});

productSchema.index({
  category: 1,
});

productSchema.index({
  bestSeller: 1,
});

productSchema.index({
  latest: 1,
});

productSchema.virtual("minPrice").get(function () {
  const prices = this.variants.flatMap((variant) =>
    variant.options.map((option) => option.salePrice ?? option.price),
  );

  return prices.length ? Math.min(...prices) : 0;
});

productSchema.virtual("maxPrice").get(function () {
  const prices = this.variants.flatMap((variant) =>
    variant.options.map((option) => option.salePrice ?? option.price),
  );

  return prices.length ? Math.max(...prices) : 0;
});

productSchema.virtual("totalStock").get(function () {
  return this.variants.reduce((variantTotal, variant) => {
    const optionStock = variant.options.reduce(
      (optionTotal, option) => optionTotal + option.stock,
      0,
    );

    return variantTotal + optionStock;
  }, 0);
});
productSchema.virtual("inStock").get(function () {
  return this.totalStock > 0;
});

productSchema.set("toJSON", {
  virtuals: true,
});

productSchema.set("toObject", {
  virtuals: true,
});

export default mongoose.model("Product", productSchema);
