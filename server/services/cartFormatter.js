export const formatCart = async (cart) => {
  if (!cart) {
    return {
      items: [],
      totalItems: 0,
      totalQuantity: 0,
      subtotal: 0,
      totalSavings: 0,
    };
  }

  await cart.populate({
    path: "items.product",
    populate: {
      path: "category",
      select: "name slug",
    },
  });

  const validItems = [];

  let subtotal = 0;
  let totalSavings = 0;
  let totalQuantity = 0;
  let hasInvalidItems = false;

  for (const item of cart.items) {
    const product = item.product;

    if (
      !product ||
      product.isDeleted ||
      !product.isActive ||
      product.status !== "published"
    ) {
      hasInvalidItems = true;
      continue;
    }

    const variant = product.variants.find(
      (variant) => variant.sku === item.sku && variant.isActive,
    );

    if (!variant) {
      hasInvalidItems = true;
      continue;
    }

    const option = variant.options.find((option) => option.size === item.size);

    if (!option) {
      hasInvalidItems = true;
      continue;
    }

    const currentPrice = option.salePrice ?? option.price;
    const itemTotal = currentPrice * item.quantity;
    const saving = option.salePrice ? (option.price - option.salePrice) * item.quantity : 0;

    subtotal += itemTotal;
    totalSavings += saving;
    totalQuantity += item.quantity;

    validItems.push({
      cartItemId: item._id,
      quantity: item.quantity,
      total: itemTotal,

      product: {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        featuredImage: product.featuredImage,
        category: product.category,
      },

      variant: {
        sku: variant.sku,
        color: variant.color,
        size: option.size,
        price: option.price,
        salePrice: option.salePrice,
        stock: option.stock,
        selectedImage: item.selectedImage,
      },
    });
  }

  if (hasInvalidItems) {
    cart.items = cart.items.filter((item) =>
      validItems.some(
        (valid) => valid.cartItemId.toString() === item._id.toString(),
      ),
    );
    await cart.save();
  }

  return {
    items: validItems,
    totalItems: validItems.length,
    totalQuantity,
    subtotal,
    totalSavings,
  };
};
