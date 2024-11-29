import User from "@/models/User";
import { dbConnect } from "@/utils/db";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { name, email, password } = await request.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    // hash password
    const salt = await genSaltSync(10);
    const hashedPassword = await hashSync(password, salt);
    console.log("password: ", password);
    console.log("hash: ", hashedPassword);

    // Buat user baru
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error: ", error }, { status: 500 });
  }
}
