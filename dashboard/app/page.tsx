import { authOptions } from "./api/auth/[...nextauth]/auth-options";
import { SignInPage } from "@/components/sign-in-page";
import { StripePricingTable } from "@/components/stripe-pricing-table";
import { isLoggedInSession } from "@/lib/logged-in";
import { getRequiredEnvVar } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Script from "next/script";

export default async function IndexPage() {
  const session = await getServerSession(authOptions);
  if (isLoggedInSession(session)) {
    const subscriptionRequest = await fetch(
      `${getRequiredEnvVar("ZUPLO_URL")}/v1/stripe-subscription`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (subscriptionRequest.ok) {
      redirect("/dashboard");
    }
  }

  return (
    <>
      <Script src="https://js.stripe.com/v3/pricing-table.js" />

      {session?.user ? <StripePricingTable /> : <SignInPage />}
    </>
  );
}
