"use server";

import { db } from "../index";
import { emailVerificationtoken, users } from "../schema";
import { eq } from "drizzle-orm";
import { generatetoken } from "./token";
import { sendemail, sendemailpass } from "./emailcomfirm";

const bcrypt = require("bcrypt");

export const checktoken = async (token: string) => {
  const exittoken = await db.query.emailVerificationtoken.findFirst({
    where: eq(emailVerificationtoken.token, token),
  });
  if (!exittoken) {
    return { error: "Invalid Token!" };
  }
  const isExpires = new Date() > new Date(exittoken.expires);
  if (isExpires) {
    return {
      error: "Sorry, confirm message is expired! Please regirster again.",
    };
  }
  await db
    .update(users)
    .set({
      emailVerified: new Date(),
    })
    .where(eq(users.email, exittoken.email));

  await db
    .delete(emailVerificationtoken)
    .where(eq(emailVerificationtoken.id, exittoken.id));
  return {
    success: "You Successfully Confirmed Your Email. Please Login.",
  };
};

export const register = async (formdata: FormData) => {
  const name = formdata.get("username")?.toString();
  const email = formdata.get("email")?.toString();
  const userpassword = formdata.get("password")?.toString();

  // already exists check
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email!));

  if (existingUser.length) {
    if (!existingUser[0].emailVerified) {
      const token = await generatetoken(email!);
      await sendemail(token[0].email, token[0].token, name);
      return {
        success: true,
        message: `We resent email verification to ${email}`,
      };
    } else {
      return {
        success: false,
        message: "This Email is Already Exited!",
      };
    }
  }

  // hash password
  const password = await bcrypt.hash(userpassword, 10);

  // generate token
  const token = await generatetoken(email!);
  await sendemail(token[0].email, token[0].token, name);

  //role
  const role = email === "jas794613@gmail.com" ? "admin" : "user";

  // create user
  await db.insert(users).values({
    name,
    email,
    password,
    role,
  });

  return {
    success: true,
    message: `We sent email verification to ${email}`,
  };
};

export const resetpassword = async (formdata: FormData) => {
  const email = formdata.get("email")?.toString();
  // already exists check
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email!));

  if (existingUser.length) {
    const token = await generatetoken(email!);
    await sendemailpass(token[0].email, token[0].token, "User");
    return {
      success: true,
      message: `We sent password reset email to ${email}`,
    };
  }
  return {
    success: false,
    message: `There is no user associated with this ${email}`,
  };
};

export const changepassword = async (formdata: FormData) => {
  const newPassword = formdata.get("newPassword")?.toString();
  const confirmPassword = formdata.get("confirmPassword")?.toString();
  const email = formdata.get("email")?.toString();
  if (newPassword !== confirmPassword) {
    return {
      success: false,
      message: "New passwords and confirm passwords do not equal!",
    };
  }
  await db
    .update(users)
    .set({
      password: await bcrypt.hash(newPassword!, 10),
    })
    .where(eq(users.email, email!));
  return {
    success: true,
    message: "You Successfully Changed Your Password. Please Login.",
  };
};

export const userInfo = async (email: string) => {
  const exitemail = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (exitemail) {
    return {
      success: true,
      result: exitemail!,
    };
  }
  return {
    success: false,
  };
};

export const changeprofile = async (formdata: FormData) => {
  const newName = formdata.get("name")?.toString();
  const email = formdata.get("email")?.toString();
  await db
    .update(users)
    .set({
      name: newName,
    })
    .where(eq(users.email, email!));

  return {
    success: true,
    message: "You Successfully Changed Your Profile.",
  };
};

export const isTwo = async (email: string | null) => {
  if (!email) return null;
  const exittwo = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  await db
    .update(users)
    .set({
      isTwo: !exittwo?.isTwo,
    })
    .where(eq(users.email, email));
  return {
    success: true,
  };
};

export const updateProfile = async (url: string, email: string) => {
  await db
    .update(users)
    .set({
      image: url,
    })
    .where(eq(users.email, email!));

  return {
    success: true,
    message: "You Successfully Changed Your Profile Image.",
  };
};
