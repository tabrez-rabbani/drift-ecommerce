import heroModel from "../models/hero.model.js";

export const insertHeroSlide = async (data) => {
    return await heroModel.create(data);
};

export const fetchAllHeroSlides = async () => {
    return await heroModel.find().select("-__v").sort({ order: 1, createdAt: -1 }).lean();
};

export const fetchActiveHeroSlides = async () => {
    return await heroModel.find({ isActive: true }).select("-__v").sort({ order: 1, createdAt: -1 }).lean();
};

export const findHeroSlideById = async (id) => {
    return await heroModel.findById(id).select("-__v").lean();
};

export const updateHeroSlideById = async (id, data) => {
    return await heroModel.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true });
};

export const removeHeroSlideById = async (id) => {
    return await heroModel.findByIdAndDelete(id);
};

export const countHeroSlides = async () => {
    return await heroModel.countDocuments();
};
