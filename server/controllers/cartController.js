import logger from "../utils/logger.js";

import {
    addToCartService,
    getCartService,
    updateCartQuantityService,
    removeCartItemService,
    clearCartService,
} from "../services/cartServices.js";

import {
    validateAddToCart,
    validateUpdateCartQuantity,
    validateRemoveCartItem,
} from "../utils/cartValidation.js";

import {
    startTransaction,
    commitTransaction,
    abortTransaction,
    endTransaction,
} from "../services/ProductServices.js"



/*
=====================================
Add To Cart
=====================================
*/

export const addToCart = async (
    req,
    res,
    next
) => {

    const session = await startTransaction();

    try {

        const { error } = validateAddToCart(req.body);

        if (error) {

            logger.warn(error.details[0].message);

            throw new Error(error.details[0].message);

        }

        const cart = await addToCartService({

            userId: req.user.id,

            body: req.body,

            session,

        });

        await commitTransaction(session);

        return res.status(200).json({

            success: true,

            message: "Product added to cart successfully.",

            cart,

        });

    }

    catch (error) {

        await abortTransaction(session);

        next(error);

    }

    finally {

        await endTransaction(session);

    }

};



/*
=====================================
Get Cart
=====================================
*/

export const getCart = async (
    req,
    res,
    next
) => {

    try {

        const cart = await getCartService(

            req.user.id

        );

        return res.status(200).json({

            success: true,

            cart,

        });

    }

    catch (error) {

        next(error);

    }

};



/*
=====================================
Update Quantity
=====================================
*/

export const updateCartQuantity = async (
    req,
    res,
    next
) => {

    const session = await startTransaction();

    try {

        const body = {

            cartItemId: req.params.cartItemId,

            quantity: req.body.quantity,

        };

        const { error } = validateUpdateCartQuantity(body);

        if (error) {

            logger.warn(error.details[0].message);

            throw new Error(error.details[0].message);

        }

        const cart = await updateCartQuantityService({

            userId: req.user.id,

            body,

            session,

        });

        await commitTransaction(session);

        return res.status(200).json({

            success: true,

            message: "Cart quantity updated successfully.",

            cart,

        });

    }

    catch (error) {

        await abortTransaction(session);

        next(error);

    }

    finally {

        await endTransaction(session);

    }

};



/*
=====================================
Remove Item
=====================================
*/

export const removeCartItem = async (
    req,
    res,
    next
) => {

    const session = await startTransaction();

    try {

        const body = {

            cartItemId: req.params.cartItemId,

        };

        const { error } = validateRemoveCartItem(body);

        if (error) {

            logger.warn(error.details[0].message);

            throw new Error(error.details[0].message);

        }

        const cart = await removeCartItemService({

            userId: req.user.id,

            body,

            session,

        });

        await commitTransaction(session);

        return res.status(200).json({

            success: true,

            message: "Item removed from cart successfully.",

            cart,

        });

    }

    catch (error) {

        await abortTransaction(session);

        next(error);

    }

    finally {

        await endTransaction(session);

    }

};


/*
=====================================
Clear Cart
=====================================
*/

export const clearCart = async (
    req,
    res,
    next
) => {

    const session = await startTransaction();

    try {

        const cart = await clearCartService({

            userId: req.user.id,

            session,

        });

        await commitTransaction(session);

        return res.status(200).json({

            success: true,

            message: "Cart cleared successfully.",

            cart,

        });

    }

    catch (error) {

        await abortTransaction(session);

        next(error);

    }

    finally {

        await endTransaction(session);

    }

};