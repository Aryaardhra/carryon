import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../configs/cloudinary.js";
import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";
import logger from "../utils/logger.js";
import slugify from "slugify";

export const addCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    console.log(name);

    if (!name?.trim()) {
      logger.warn("Category name is required");
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existingCategory = await categoryModel.findOne({
      name: {
        $regex: new RegExp(`^${name.trim()}$`, "i"),
      },
    });

    if (existingCategory) {
      logger.warn(`Category already exists: ${name}`);
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    let image = {};

    if (req.file) {
      const result = await uploadToCloudinary(req.file);

      image = {
        public_id: result.public_id,
        url: result.secure_url,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
      };
    }

    const category = await categoryModel.create({
      name: name.trim(),
      slug: slugify(name, {
        lower: true,
        strict: true,
      }),
      image,
    });

    logger.info(`Category created: ${category.name}`);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    logger.error(`Add Category Error: ${error.message}`);
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryModel.find();

    logger.info("Fetched all categories");

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
};
export const getActiveCategories = async (req, res, next) => {
  try {
    const categories = await categoryModel.find({
      isActive: true,
    });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      logger.warn("Category not found");

      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      logger.warn("Category not found");

      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const { name } = req.body;

    if (name?.trim()) {
      category.name = name.trim();
      category.slug = slugify(name, {
        lower: true,
        strict: true,
      });
    }

    if (req.file) {
      if (category.image.public_id) {
        await deleteFromCloudinary(category.image.public_id);
      }

      const result = await uploadToCloudinary(req.file);

      category.image = {
        public_id: result.public_id,
        url: result.secure_url,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
      };
    }
   
    await category.save();

    logger.info(`Category updated: ${category.name}`);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
};

export const toggleCategoryStatus = async (req, res, next) => {
  try {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.isActive = !category.isActive;

    await category.save();

    return res.status(200).json({
      success: true,
      message: `Category ${
        category.isActive ? "activated" : "deactivated"
      } successfully`,
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      logger.warn("Category not found");

      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const productExist = await productModel.exists({
      category: category._id,
      isActive: true,
    });
    if (productExist) {
      logger.warn(
        `Cannot delete category "${category.name}" because products exist`,
      );

      return res.status(400).json({
        success: false,
        message: "Cannot delete category because products are assigned to it.",
      });
    }

    category.isActive = false;

    await category.save();

    logger.info(`Category deleted: ${category.name}`);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
};
