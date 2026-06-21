// Get the full source code, including the theme and Tailwind config:
// https://github.com/resend/react-email/tree/canary/apps/demo/emails

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface PlaidVerifyIdentityEmailProps {
  validationCode?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const PlaidVerifyIdentityEmail = ({
  validationCode,
}: PlaidVerifyIdentityEmailProps) => (
  <Html>
    <Head />

    <Body className="bg-white font-plaid">
      <Container className="bg-white border border-solid border-[#eee] rounded shadow-[rgba(20,50,70,.2)] shadow-md mt-5 max-w-90 mx-auto my-0 pt-17 px-0 pb-32.5">
        <i className="fa-brands text-3xl text-green-500 fa-shopify"></i>
        <Text className="text-[#0a85ea] text-[11px] font-bold h-4 tracking-normal leading-4 mt-4 mb-2 mx-2 uppercase text-center">
          Verify Your Account
        </Text>
        <Heading className="text-black font-medium font-[HelveticaNeue-Medium,Helvetica,Arial,sans-serif] inline-block text-[20px] leading-5.75 my-0 text-center">
          This is the codes to verify your account.It will expired in 15 mins.
        </Heading>
        <Section className="bg-[rgba(0,0,0,.05)] rounded mx-auto font-[HelveticaNeue-Bold] mt-4 mb-3.5 align-middle w-70">
          <Text className="text-black text-[32px] font-bold tracking-[6px] leading-10 py-2 mx-auto my-0 block text-center">
            {validationCode}
          </Text>
        </Section>
        <Text className="text-[#444] text-[15px] leading-5.75 tracking-normal py-0 px-10 m-0 text-center">
          Not expecting this email?
        </Text>
        <Text className="text-[#444] text-[15px] leading-5.75 tracking-normal py-0 px-10 m-0 text-center">
          Contact{" "}
          <Link href="mailto:login@plaid.com" className="text-[#444] underline">
            Snap-Shop
          </Link>{" "}
          if you did not request this code.
        </Text>
      </Container>
      <Text className="text-green-500 text-xs font-extrabold tracking-normal leading-5.75 m-0 mt-5 text-center uppercase">
        Securely powered by Snap-Shop.
      </Text>
    </Body>
  </Html>
);

PlaidVerifyIdentityEmail.PreviewProps = {
  validationCode: "144833",
} as PlaidVerifyIdentityEmailProps;

export default PlaidVerifyIdentityEmail;
