import categoryModel from "../models/category.model.js";

export const insertCategory = async (data) => {
    return await categoryModel.create(data);
};

export const fetchAllCategories = async () => {
    return await categoryModel.find().select("-__v").sort({ order: 1, createdAt: 1 }).lean();
};

export const findCategoryByName = async (name) => {
    return await categoryModel.findOne({ name }).select("-__v").lean();
};

export const findCategoryById = async (id) => {
    return await categoryModel.findById(id).select("-__v").lean();
};

export const updateCategoryById = async (id, data) => {
    return await categoryModel.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true });
};

export const removeCategoryById = async (id) => {
    return await categoryModel.findByIdAndDelete(id);
};
