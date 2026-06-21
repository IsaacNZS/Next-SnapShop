"use server";

import { db } from "../index";
import { otptoken, users } from "../schema";
import { eq } from "drizzle-orm";
import { generateOTP } from "./token";
import { sendemailotp } from "./emailcomfirm";
const bcrypt = require("bcrypt");

export const login = async (formdata: FormData) => {
  const password = formdata.get("password")?.toString();
  const email = formdata.get("email")?.toString();

  // email already exists check
  const existingmail = await db
    .select()
    .from(users)
    .where(eq(users.email, email!));

  if (existingmail.length === 0) {
    return {
      success: false,
      message: "Something Is Wrong!",
    };
  }

  if (!existingmail[0].isTwo) {
    const hashedPassword = existingmail[0].password;
    const passwordprepair = await bcrypt.compare(password, hashedPassword);

    if (!passwordprepair) {
      return {
        success: false,
        message: "Something Is Wrong!",
      };
    }

    if (existingmail[0].emailVerified) {
      return {
        success: true,
        existingmail,
      };
    } else {
      return {
        success: false,
        message: "This email is not confirmed! Please register again.",
      };
    }
  } else {
    const token = await generateOTP(email!);
    await sendemailotp(token[0].email, token[0].token);
    return {
      istwo: true,
      email,
      password,
      message: `We resent OTP code to ${email}`,
    };
  }
};

export const loginwithOTP = async (formdata: FormData) => {
  const password = formdata.get("password")?.toString();
  const email = formdata.get("email")?.toString();
  const otp = formdata.get("otp")?.toString();

  if (!otp) return null;
  // email already exists check
  const existingmail = await db
    .select()
    .from(users)
    .where(eq(users.email, email!));

  if (existingmail.length === 0) {
    return {
      success: false,
      message: "Something Is Wrong!",
    };
  }

  const hashedPassword = existingmail[0].password;
  const passwordprepair = await bcrypt.compare(password, hashedPassword);

  if (!passwordprepair) {
    return {
      success: false,
      message: "Something Is Wrong!",
    };
  }

  const existingOTPmail = await db
    .select()
    .from(otptoken)
    .where(eq(otptoken.email, email!));

  if (existingOTPmail.length === 0) {
    return {
      success: false,
      message: "Something Is Wrong!",
    };
  }

  if (otp !== existingOTPmail[0].token) {
    console.log(otp, existingOTPmail[0].token);
    return { success: false, message: "Invalid OTP!" };
  }
  const isExpires = new Date() > new Date(existingOTPmail[0].expires);
  if (isExpires) {
    return {
      success: false,
      message: "Sorry, OTP is expired! Please Resend.",
    };
  }

  await db.delete(otptoken).where(eq(otptoken.id, existingOTPmail[0].id));

  if (existingmail[0].emailVerified) {
    return {
      success: true,
      message: "You Succefully Logined",
      existingmail,
    };
  } else {
    return {
      success: false,
      message: "This email is not confirmed! Please register again.",
    };
  }
};
