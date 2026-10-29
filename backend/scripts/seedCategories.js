import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import categoryModel from "../src/models/category.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../.env") });

const initialCategories = [
    { name: "SHIRTS", slug: "shirts", image: "/images/category/shirt.webp", order: 1 },
    { name: "TROUSERS", slug: "trousers", image: "/images/category/trousers.webp", order: 2 },
    { name: "T-SHIRTS", slug: "t-shirts", image: "/images/category/tshirt.webp", order: 3 },
    { name: "JEANS", slug: "jeans", image: "/images/category/jeans.webp", order: 4 },
    { name: "CARGOS", slug: "cargos", image: "/images/category/cargos.webp", order: 5 },
    { name: "POLOS", slug: "polos", image: "/images/category/polos.webp", order: 6 },
    { name: "OUTERWEAR", slug: "outerwear", image: "/images/category/outerwear.webp", order: 7 },
    { name: "PLUS SIZE", slug: "plus-size", image: "/images/category/plus size.webp", order: 8 },
    { name: "SNEAKERS", slug: "sneakers", image: "/images/category/sneakers.webp", order: 9 },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        for (const cat of initialCategories) {
            await categoryModel.findOneAndUpdate(
                { slug: cat.slug },
                { $set: cat },
                { upsert: true, new: true }
            );
        }
    } catch (err) {
        console.error("Category seed error:", err.message);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
