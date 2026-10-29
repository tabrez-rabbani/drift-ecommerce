import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

export async function getCartDetails(userId) {
    const userObjectId = new mongoose.Types.ObjectId(String(userId));

    const [cart] = await cartModel.aggregate([
        { $match: { user: userObjectId } },
        {
            $addFields: {
                hasItems: {
                    $gt: [{ $size: { $ifNull: ["$items", []] } }, 0],
                },
            },
        },
        { $unwind: { path: "$items", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "productData",
            },
        },
        { $unwind: { path: "$productData", preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                isValidItem: {
                    $and: [
                        { $eq: ["$hasItems", true] },
                        { $ne: [{ $ifNull: ["$items.product", null] }, null] },
                        { $ne: [{ $ifNull: ["$productData._id", null] }, null] },
                    ],
                },
            },
        },
        {
            $addFields: {
                "items.product": {
                    $cond: ["$isValidItem", "$productData", null],
                },
                "items.itemPrice": {
                    $cond: [
                        "$isValidItem",
                        {
                            $multiply: [
                                { $ifNull: ["$items.quantity", 0] },
                                { $ifNull: ["$productData.price.amount", 0] },
                            ],
                        },
                        0,
                    ],
                },
            },
        },
        {
            $group: {
                _id: "$_id",
                totalPrice: { $sum: "$items.itemPrice" },
                currency: {
                    $first: { $ifNull: ["$productData.price.currency", "INR"] },
                },
                items: {
                    $push: {
                        $cond: ["$isValidItem", "$items", "$$REMOVE"],
                    },
                },
            },
        },
        {
            $project: {
                totalPrice: 1,
                currency: 1,
                items: {
                    $filter: {
                        input: "$items",
                        as: "item",
                        cond: {
                            $and: [
                                { $ne: ["$$item", null] },
                                { $ne: [{ $ifNull: ["$$item.product._id", null] }, null] },
                            ],
                        },
                    },
                },
            },
        },
    ]);

    return cart || { items: [], totalPrice: 0, currency: "INR" };
}