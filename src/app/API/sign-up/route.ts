import { sendVerifyEmail } from "@/helpers/sendVerifiyEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request, res: Response) {
  await dbConnect();

  try {
    const { username, email, password, verifyCode } = await request.json();

    const existongUserVerifyByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existongUserVerifyByUsername) {
      return Response.json(
        {
          message: "Username already exists",
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    const existingUserVerifyByEmail = await UserModel.findOne({
      email,
      isVerified: true,
    });

    if (existingUserVerifyByEmail) {
      if (existingUserVerifyByEmail.isVerified) {
        return Response.json(
          {
            message: "Email already exists, ",
            success: false,
          },
          {
            status: 400,
          }
        );
      } else {
        const hasedPassword = await bcrypt.hash(password, 10);
        existingUserVerifyByEmail.password = hasedPassword;
        existingUserVerifyByEmail.verifyCode = verifyCode;
        existingUserVerifyByEmail.verifyCodeExpires = new Date(
          Date.now() + 3600000
        );
        await existingUserVerifyByEmail.save();
      }
    } else {
      const hasedPassword = await bcrypt.hash(password, 10);
      const expirayDate = new Date();
      expirayDate.setHours(expirayDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hasedPassword,
        verifyCode: Math.random().toString(36).substring(7),
        verifyCodeExpires: expirayDate,
      });

      await newUser.save();
    }

    // Send verification email

    const emailResponse = await sendVerifyEmail(email, username, verifyCode);

    if (!emailResponse.success) {
      return Response.json(
        {
          message: emailResponse.message,
          success: false,
        },
        {
          status: 500,
        }
      );
    }
    return Response.json(
      {
        message: "User signed up successfully, please verify your email",
        success: true,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error signing up: ", error);
    return Response.json(
      {
        message: "Error signing up",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
