import asyncHandler from "../middlewares/asyncHandler.js";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import AppError from "../utils/AppError.js";
import { getCartDetails } from "../dao/cart.dao.js";

export const addToCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { color, size, quantity = 1 } = req.body;

    const product = await productModel.findById(productId);
    if (!product) throw new AppError("Product not found", 404);

    if (!product.inStock) {
        return res.status(400).json({
            success: false,
            message: "Product is out of stock",
        });
    }

    const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
    const isValidColor = hasColors
        ? product.colors.some((c) => (c.name || "").toLowerCase() === (color || "").toLowerCase())
        : true;
    const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
    const isValidSize = hasSizes
        ? product.sizes.some((s) => String(s).toLowerCase() === String(size).toLowerCase())
        : true;

    if (!isValidColor || !isValidSize) {
        throw new AppError("Invalid color or size selected", 400);
    }

    // Atomic update to avoid race conditions and duplicate items
    const matched = await cartModel.findOneAndUpdate(
        { user: req.user._id, "items.product": productId, "items.color": color, "items.size": size },
        { $inc: { "items.$.quantity": quantity } }
    );

    if (!matched) {
        await cartModel.findOneAndUpdate(
            { user: req.user._id },
            { $push: { items: { product: productId, color, size, quantity, price: product.price } } },
            { upsert: true, new: true }
        );
    }

    return res.status(200).json({
        success: true,
        message: "Product added to cart successfully",
    });
});

export const getCart = asyncHandler(async (req, res) => {
    const existing = await cartModel.findOne({ user: req.user._id }).select("_id");
    if (!existing) await cartModel.create({ user: req.user._id });

    const cart = await getCartDetails(req.user._id);

    return res.status(200).json({
        success: true,
        message: "Cart fetched successfully",
        cart: cart || { items: [], totalPrice: 0, currency: "INR" },
    });
});

export const incrementCartItemQuantity = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { color, size } = req.body;

    const product = await productModel.findById(productId);
    if (!product) throw new AppError("Product not found", 404);
    if (!product.inStock) throw new AppError("Product is out of stock", 400);

    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) throw new AppError("Cart not found", 404);

    await cartModel.findOneAndUpdate(
        { user: req.user._id, "items.product": productId, "items.color": color, "items.size": size },
        { $inc: { "items.$.quantity": 1 } }
    );

    return res.status(200).json({
        success: true,
        message: "Cart item quantity incremented successfully",
    });
});

export const decrementCartItemQuantity = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { color, size } = req.body;

    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) throw new AppError("Cart not found", 404);

    const item = cart.items.find(
        (i) => i.product.toString() === productId && i.color === color && i.size === size
    );
    if (!item) throw new AppError("Cart item not found", 404);

    if (item.quantity <= 1) {
        await cartModel.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { items: { product: productId, color, size } } }
        );

        return res.status(200).json({
            success: true,
            message: "Cart item removed successfully",
        });
    }

    await cartModel.findOneAndUpdate(
        { user: req.user._id, "items.product": productId, "items.color": color, "items.size": size },
        { $inc: { "items.$.quantity": -1 } }
    );

    return res.status(200).json({
        success: true,
        message: "Cart item quantity decremented successfully",
    });
});

export const removeCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { color, size } = req.body;

    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) throw new AppError("Cart not found", 404);

    await cartModel.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { items: { product: productId, color, size } } }
    );

    return res.status(200).json({
        success: true,
        message: "Cart item removed successfully",
    });
});