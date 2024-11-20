import mongoose, { Schema, model, models } from "mongoose";
import slug from "slug";

export interface IArticle {
  _id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  categories: mongoose.Schema.Types.ObjectId[]; // Referensi ke kategori
  createdAt: Date;
  updatedAt?: Date;
}

const articleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    content: { type: String, required: true },
    thumbnail: { type: String, required: true },
    categories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // Referensi ke model Category
    ],
  },
  { timestamps: true }
);

// Hook untuk menetapkan slug sebelum disimpan
articleSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = slug(this.title);
  }
  console.log("Slug before validation:", this.slug); // Debugging slug
  next();
});

const Article = models.Article || model<IArticle>("Article", articleSchema);

export default Article;
