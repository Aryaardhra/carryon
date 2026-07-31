import Joi from "joi";

export const validateAddToCart = (body) => {
  const schema = Joi.object({
    productId: Joi.string()
      .required()
      .messages({
        "any.required": "Product ID is required.",
      }),

    color: Joi.string()
      .trim()
      .required()
      .messages({
        "any.required": "Color is required.",
      }),

    size: Joi.string()
      .trim()
      .uppercase()
      .valid("XS", "S", "M", "L", "XL", "XXL")
      .required()
      .messages({
        "any.required": "Size is required.",
        "any.only":
          "Size must be one of XS, S, M, L, XL, XXL.",
      }),

    selectedImage: Joi.string()
      .uri()
      .required()
      .messages({
        "any.required": "Selected image is required.",
        "string.uri": "Selected image must be a valid URL.",
      }),

    quantity: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .messages({
        "number.base": "Quantity must be a number.",
        "number.min": "Quantity must be at least 1.",
      }),
  });

  return schema.validate(body);
};

export const validateUpdateCartQuantity = (body) => {

    const schema = Joi.object({
        cartItemId: Joi.string().required().messages({"any.required":"Cart item id is required."}),
        quantity: Joi.number().integer().min(1).required().messages({"number.min":"Quantity must be greater than zero."}),
    });

    return schema.validate(body);

};
export const validateRemoveCartItem = (body) => {

    const schema = Joi.object({
        cartItemId: Joi.string().required().messages({"any.required": "Cart item id is required."}),
    });

    return schema.validate(body);
};