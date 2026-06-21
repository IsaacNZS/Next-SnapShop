// Get the full source code, including the theme and Tailwind config:
// https://github.com/resend/react-email/tree/canary/apps/demo/emails

import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "react-email";

interface DropboxResetPasswordEmailProps {
  userFirstname?: string;
  resetPasswordLink?: string;
}

export const DropboxResetPasswordEmail = ({
  userFirstname,
  resetPasswordLink,
}: DropboxResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Body className="bg-[#f6f9fc] py-2.5">
        <Preview>Registeration Account Comfirmation - SnapShop</Preview>
        <Container className="bg-white border border-solid border-[#f0f0f0] p-11.25">
          <div className="flex items-center">
            {" "}
            <h1 className="text-3xl mr-4 font-bold text-green-500">
              Snap-Shop
            </h1>
            <i className="fa-brands text-3xl w-70 h-70 text-green-500 fa-shopify"></i>
          </div>
          <Section>
            <Text className="text-base font-dropbox font-light text-[#404040] leading-6.5">
              Hi {userFirstname},
            </Text>
            <Text className="text-base font-dropbox font-light text-[#404040] leading-6.5">
              Thank for join with us. Please click this button to comfirm your
              email.
            </Text>
            <Button
              className="px-3 py-2 rounded-[5px] text-white bg-green-500 text-[15px] no-underline text-center font-dropbox-sans block w-52.5"
              href={resetPasswordLink}
            >
              Comfirm Email
            </Button>
            <Text className="text-base font-dropbox font-light text-[#404040] leading-6.5">
              If you don&apos;t want to comfirm your email or didn&apos;t
              request this, just ignore and delete this message.
            </Text>
            <Text className="text-base font-dropbox font-light text-[#404040] leading-6.5">
              To keep your account secure, please don&apos;t forward this email
              to anyone. See our Help Center for{" "}
              <Link className="underline" href={resetPasswordLink}>
                more security tips.
              </Link>
            </Text>
            <Text className="text-base font-dropbox font-light text-[#404040] leading-6.5">
              Happy SnapShop!
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

DropboxResetPasswordEmail.PreviewProps = {
  userFirstname: "SnapShop",
  resetPasswordLink: "https://www.dropbox.com",
} as DropboxResetPasswordEmailProps;

export default DropboxResetPasswordEmail;
