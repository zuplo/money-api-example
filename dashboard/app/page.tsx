import { authOptions } from "./api/auth/[...nextauth]/auth-options";
import { SignInPage } from "@/components/sign-in-page";
import { StripeSubscriptionTable } from "@/components/stripe-subscription";
import { getStripeSubscriptionByEmail } from "@/lib/stripe/user-subscription";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Script from "next/script";

export default async function IndexPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    const subscriptionResult = await getStripeSubscriptionByEmail(
      session.user.email
    );
    if (subscriptionResult.ok) {
      redirect("/dashboard");
    }
  }

  return (
    <>
      <Script src="https://js.stripe.com/v3/pricing-table.js" />

      {session?.user ? <StripeSubscriptionTable /> : <SignInPage />}
    </>
  );
}
