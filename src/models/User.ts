import { models, model, Schema } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

// Middleware untuk hash password sebelum menyimpan user
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await genSaltSync(10);
//   this.password = await hashSync(this.password, salt);
//   next();
// });

// Method untuk membandingkan password
// userSchema.methods.comparePassword = async function (password: string) {
//   return await compareSync(password, this.password);
// };

const User = models.User || model("User", userSchema);
export default User;
