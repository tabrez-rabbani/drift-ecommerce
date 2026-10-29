import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../.env") });

const heroSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desktopImage: { type: String, required: true },
    mobileImage: { type: String, default: "" },
    ctaLink: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    eyebrow: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    ctaText: { type: String, default: "" },
    ratingText: { type: String, default: "" },
    showSocialProof: { type: Boolean, default: false }
}, { timestamps: true });

const Hero = mongoose.model("hero", heroSchema);

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const count = await Hero.countDocuments();
        if (count === 0) {
            const initialSlides = [
                { title: "Slide 1", desktopImage: "/images/hero/slide1.webp", order: 1, isActive: true },
                { title: "Slide 2", desktopImage: "/images/hero/slide2.webp", order: 2, isActive: true },
                { title: "Slide 3", desktopImage: "/images/hero/slide3.webp", order: 3, isActive: true },
                { title: "Slide 4", desktopImage: "/images/hero/slide4.webp", order: 4, isActive: true },
                { title: "Slide 5", desktopImage: "/images/hero/slide5.webp", order: 5, isActive: true },
            ];

            await Hero.insertMany(initialSlides);
            console.log("5 Hero slides seeded successfully into database!");
        } else {
            console.log(`Hero collection already has ${count} slides, skipping seed.`);
        }
    } catch (err) {
        console.error("Seed error:", err.message);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

seed();
