import Joi from "joi";

export const validateRegistration = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/),
  });
  return schema.validate(data);
};

export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/),
  });
  return schema.validate(data);
};

export const validateResetPassword = (data) => {
  const schema = Joi.object({
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
      .required(),
    confirmPassword: Joi.any()
      .valid(Joi.ref("password"))
      .required()
      .messages({"any.only": "Passwords do not match."})
  })
  return schema.validate(data);
};

export const validateChangePassword = (data) => {
  const schema = Joi.object({
    currentPassword: Joi.string()
      .min(8)
      .max(30)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
      .required(),
    newPassword: Joi.string()
      .min(8)
      .max(30)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
      .required(),
    confirmPassword: Joi.string()
      .min(8)
      .max(30)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
      .required(),
  });
  return schema.validate(data);
};
