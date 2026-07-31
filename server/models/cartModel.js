import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    sku: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    size: {
      type: String,
      required: true,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },

     selectedImage: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    // Price when the item was added
    addedPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // Sale price when the item was added
    addedSalePrice: {
      type: Number,
      default: null,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

//Prevent duplicate product + SKU combinations inside the same cart.

cartSchema.index({
  user: 1,
  "items.product": 1,
  "items.sku": 1,
});

export default mongoose.model("Cart", cartSchema);
