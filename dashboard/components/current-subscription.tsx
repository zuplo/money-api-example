import { StripeActiveSubscription } from "@/lib/stripe/user-subscription";

export const CurrentSubscription = ({
  customerSubscription,
}: {
  customerSubscription: StripeActiveSubscription;
}) => {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <p>
        You have made <b>{customerSubscription?.usage?.total_usage}</b> requests
        this month
      </p>
    </div>
  );
};
