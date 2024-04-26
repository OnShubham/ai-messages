import mongoose from "mongoose";

type ConnectOptions = {
  isConnected?: number;
};

const conncetion: ConnectOptions = {};

async function dbConnect(): Promise<void> {
  if (conncetion.isConnected) {
    console.log("Already connected to the database");

    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

    conncetion.isConnected = db.connections[0].readyState;
    console.log("Connected to the database");
  } catch (error) {
    console.log("Error connecting to the database: ", error);
    process.exit(1);
  }
}

export default dbConnect;