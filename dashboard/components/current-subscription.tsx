import { StripeActiveSubscription } from "@/lib/stripe/user-subscription";
import Link from "next/link";

export const CurrentSubscription = ({
  customerSubscription,
}: {
  customerSubscription: StripeActiveSubscription;
}) => {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <p>
        You are currently subscribed to{" "}
        <b>{customerSubscription?.product.name}</b> plan
      </p>
      {customerSubscription?.usage ? (
        <p>
          You have made <b>{customerSubscription?.usage.total_usage}</b>{" "}
          requests this month
        </p>
      ) : (
        <p>
          You have{" "}
          <b>{customerSubscription?.product.metadata.maxRequestsAllowed}</b>{" "}
          requests/month
        </p>
      )}
      <p>
        Manage your subscription{" "}
        <Link
          className="text-blue-600 hover:underline"
          href={process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL || ""}
        >
          here.
        </Link>
      </p>
    </div>
  );
};
