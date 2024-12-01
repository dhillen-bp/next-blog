import mongoose, { Schema, model, models } from "mongoose";
import slug from "slug";
import Category, { ICategory } from "./Category";
import User, { IUser } from "./User";

export interface IArticle {
  _id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  // categories: mongoose.Schema.Types.ObjectId[] | ICategory[]; // Referensi ke kategori
  category: ICategory; // Referensi ke kategori
  author: IUser;
  createdAt: Date;
  updatedAt?: Date;
}

const articleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    content: { type: String, required: true },
    thumbnail: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Category,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  { timestamps: true }
);

// Hook untuk menetapkan slug sebelum disimpan
articleSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = slug(this.title);
  }
  next();
});

const Article = models.Article || model<IArticle>("Article", articleSchema);

export default Article;
