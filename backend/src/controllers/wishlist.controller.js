import wishlistModel from "../models/wishlist.model.js";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await wishlistModel
        .findOne({ user: req.user._id })
        .populate({ path: "products", select: "title slug price originalPrice colors sizes rating inStock category" });

    res.status(200).json({
        success: true,
        wishlist: wishlist?.products || [],
    });
});

export const getWishlistIds = asyncHandler(async (req, res) => {
    const wishlist = await wishlistModel.findOne({ user: req.user._id }).select("products").lean();

    res.status(200).json({
        success: true,
        productIds: wishlist?.products.map((id) => id.toString()) || [],
    });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    const wishlist = await wishlistModel.findOne({ user: userId });
    const exists = wishlist && wishlist.products.some((id) => id.toString() === productId);

    if (exists) {
        await wishlistModel.updateOne({ user: userId }, { $pull: { products: productId } });
        return res.status(200).json({
            success: true,
            message: "Removed from wishlist",
            action: "removed",
            productId,
        });
    }

    await wishlistModel.findOneAndUpdate(
        { user: userId },
        { $addToSet: { products: productId } },
        { upsert: true, new: true }
    );

    return res.status(200).json({
        success: true,
        message: "Added to wishlist",
        action: "added",
        productId,
    });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const wishlist = await wishlistModel.findOne({ user: req.user._id });
    if (!wishlist) throw new AppError("Wishlist not found", 404);

    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
    await wishlist.save();

    res.status(200).json({
        success: true,
        message: "Removed from wishlist",
        productId,
    });
});

export const clearWishlist = asyncHandler(async (req, res) => {
    await wishlistModel.updateOne({ user: req.user._id }, { $set: { products: [] } });

    res.status(200).json({
        success: true,
        message: "Wishlist cleared successfully",
    });
});

export const moveToCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { color, size, quantity = 1 } = req.body;
    const userId = req.user._id;

    const product = await productModel.findById(productId);
    if (!product) throw new AppError("Product not found", 404);

    if (!product.inStock) {
        return res.status(400).json({
            success: false,
            message: "Product is out of stock",
        });
    }

    const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
    const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
    const isValidColor = hasColors
        ? product.colors.some((c) => c.name?.toLowerCase() === color?.toLowerCase())
        : true;
    const isValidSize = hasSizes ? product.sizes.includes(size) : true;

    if (!isValidColor || !isValidSize) {
        throw new AppError("Invalid color or size selected", 400);
    }

    // Atomic cart update to prevent duplicate items or race conditions
    const matched = await cartModel.findOneAndUpdate(
        { user: userId, "items.product": productId, "items.color": color, "items.size": size },
        { $inc: { "items.$.quantity": quantity } }
    );

    if (!matched) {
        await cartModel.findOneAndUpdate(
            { user: userId },
            { $push: { items: { product: productId, color, size, quantity, price: product.price } } },
            { upsert: true, new: true }
        );
    }

    await wishlistModel.updateOne({ user: userId }, { $pull: { products: productId } });

    return res.status(200).json({
        success: true,
        message: "Moved to bag successfully",
        productId,
    });
});
