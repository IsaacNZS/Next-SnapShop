"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { emailVerificationtoken, otptoken } from "../schema";
import crypto from "node:crypto";

const check = async (email: string) => {
  try {
    const token = await db.query.emailVerificationtoken.findFirst({
      where: eq(emailVerificationtoken.email, email),
    });
    return token;
  } catch (error) {
    return null;
  }
};

export const generatetoken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 30 * 60 * 1000);
  const exittoken = await check(email);
  if (exittoken) {
    db.delete(emailVerificationtoken).where(
      eq(emailVerificationtoken.id, exittoken.id),
    );
  }
  const vt = await db
    .insert(emailVerificationtoken)
    .values({
      email,
      token,
      expires,
    })
    .returning();
  return vt;
};

const checkOTP = async (email: string) => {
  try {
    const token = await db.query.otptoken.findFirst({
      where: eq(otptoken.email, email),
    });
    return token;
  } catch (error) {
    return null;
  }
};

export const generateOTP = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 30 * 60 * 1000);
  const exittoken = await checkOTP(email);
  if (exittoken) {
    db.delete(otptoken).where(eq(otptoken.id, exittoken.id));
  }
  const otp = await db
    .insert(otptoken)
    .values({
      email,
      token,
      expires,
    })
    .returning();
  return otp;
};
