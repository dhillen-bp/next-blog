import { Schema, model, models } from "mongoose";

export interface ICategory {
  _id: string;
  name: string;
  icon: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: [100, "title cannot be grater than 100 characters"],
    },
    icon: { type: String, required: true },
  },
  { timestamps: true }
);

const Category =
  models.Category || model<ICategory>("Category", categorySchema);

export default Category;
