import { Schema, model, models } from "mongoose";
import slug from "slug";

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  icon: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      maxlength: [100, "title cannot be grater than 100 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      maxlength: [100, "title cannot be grater than 100 characters"],
    },
    icon: { type: String, required: true },
  },
  { timestamps: true }
);

categorySchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = slug(this.name);
  }
  next();
});

const Category =
  models.Category || model<ICategory>("Category", categorySchema);

export default Category;
