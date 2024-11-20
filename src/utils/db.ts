import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

const conn = {
  isConnected: false,
};

export async function dbConnect() {
  if (conn.isConnected) {
    return;
  }

  const db = await mongoose.connect(MONGODB_URI);
  // console.log(db.connection.db.databaseName);
  conn.isConnected = db.connections[0].readyState === 1;
}

mongoose.connection.on("connected", () =>
  console.log("MongoDB connected successfully")
);

mongoose.connection.on("error", (err) =>
  console.error("MongoDB connection error:", err.message)
);
