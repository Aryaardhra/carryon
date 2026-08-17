import userModel from "../models/userModel.js";
import logger from "../utils/logger.js";

export const getAddresses = async (req, res, next) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .select("addresses");

    if (!user) {
      logger.warn(`User not found: ${req.user._id}`);

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      addresses: user.addresses,
    });
  } catch (error) {
    logger.error(`Get Addresses Error: ${error.message}`);
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const {
      fullName,
      address,
      city,
      state,
      phone,
      pinCode,
      isDefault = false,
    } = req.body;

    if (
      !fullName?.trim() ||
      !address?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !phone?.trim() ||
      !pinCode?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required",
      });
    }

    const user = await userModel.findById(req.user._id);

    if (!user) {
      logger.warn(`User not found: ${req.user._id}`);

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (isDefault) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });
    }

    // If this is the user's first address,
    // automatically make it default.
    const shouldBeDefault =
      user.addresses.length === 0 || isDefault;

    user.addresses.push({
      fullName: fullName.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      phone: phone.trim(),
      pinCode: pinCode.trim(),
      isDefault: shouldBeDefault,
    });

    await user.save();

    const newAddress =
      user.addresses[user.addresses.length - 1];

    logger.info(`Address added for user: ${user.email}`);

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
      addresses: user.addresses,
    });
  } catch (error) {
    logger.error(`Add Address Error: ${error.message}`);
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    const {
      fullName,
      address,
      city,
      state,
      phone,
      pinCode,
      isDefault,
    } = req.body;

    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingAddress = user.addresses.id(addressId);

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    if (fullName !== undefined) {
      existingAddress.fullName = fullName.trim();
    }

    if (address !== undefined) {
      existingAddress.address = address.trim();
    }

    if (city !== undefined) {
      existingAddress.city = city.trim();
    }

    if (state !== undefined) {
      existingAddress.state = state.trim();
    }

    if (phone !== undefined) {
      existingAddress.phone = phone.trim();
    }

    if (pinCode !== undefined) {
      existingAddress.pinCode = pinCode.trim();
    }

    if (isDefault === true) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });

      existingAddress.isDefault = true;
    }

    await user.save();

    logger.info(
      `Address updated for user: ${user.email}`
    );

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: existingAddress,
      addresses: user.addresses,
    });
  } catch (error) {
    logger.error(`Update Address Error: ${error.message}`);
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const wasDefault = address.isDefault;

    address.deleteOne();

    // If the deleted address was default,
    // make another address default.
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    logger.info(
      `Address deleted for user: ${user.email}`
    );

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    logger.error(`Delete Address Error: ${error.message}`);
    next(error);
  }
};