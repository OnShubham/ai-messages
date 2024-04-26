import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmails";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerifyEmail(
  username: string,
  email: string,
  otp: string
): Promise<ApiResponse> {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email",
      react: VerificationEmail({ username, otp }),
    });

    return {
      success: true,
      message: "Email sent",
    };
  } catch (emailError) {
    console.error("Error sending email: ", emailError);
    return {
      success: false,
      message: "Error sending email",
    };
  }
}
