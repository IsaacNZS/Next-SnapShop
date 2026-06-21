"use server";

import { getbaseurl } from "@/app/lib/get-baseurl";
import { DropboxResetPasswordEmail } from "../../app/components/email-template";
import { Resend } from "resend";
import PlaidVerifyIdentityEmail from "@/app/components/email-otp-tem";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendemail = async (
  email: string,
  token: string,
  name: string | undefined,
) => {
  const comfirmlink = `${getbaseurl()}/comfirm-email?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Registeration Account Comfirmation - SnapShop",
    react: DropboxResetPasswordEmail({
      userFirstname: name,
      resetPasswordLink: comfirmlink,
    }),
  });

  if (error) {
    console.log(error);
  }
};

export const sendemailpass = async (
  email: string,
  token: string,
  name: string | undefined,
) => {
  const comfirmlink = `${getbaseurl()}/login/reset/passwordchange?token=${token}`;
  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset Password - SnapShop",
    react: DropboxResetPasswordEmail({
      userFirstname: name,
      resetPasswordLink: comfirmlink,
    }),
  });

  if (error) {
    console.log(error);
  }
};

export const sendemailotp = async (email: string, token: string) => {
  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset Password - SnapShop",
    react: PlaidVerifyIdentityEmail({
      validationCode: token,
    }),
  });

  if (error) {
    console.log(error);
  }
};
