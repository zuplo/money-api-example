import { Logger } from "@zuplo/runtime";
import { environment } from "@zuplo/runtime";

const STRIPE_API_KEY = environment.STRIPE_API_KEY;

export const stripeRequest = async (path: string, options?: RequestInit) => {
  return fetch("https://api.stripe.com/v1" + path, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${STRIPE_API_KEY}`,
    },
  }).then((res) => res.json());
};

export const getActiveStripeSubscription = async (
  stripeCustomerId: string,
  logger: Logger
) => {
  const customerSubscription = await stripeRequest(
    "/subscriptions?customer=" + stripeCustomerId + "&status=active&limit=1"
  );

  if (customerSubscription.data.length === 0) {
    logger.warn("customer has no subscription");
    return null;
  }

  if (
    !customerSubscription.data[0].plan ||
    customerSubscription.data[0].status !== "active"
  ) {
    logger.warn("customer has no subscription plan");
    return null;
  }

  return customerSubscription.data[0];
};

export const getStripeProduct = async (productId: string) => {
  return stripeRequest("/products/" + productId);
};

export const triggerMeteredSubscriptionItemUsage = async (
  subscriptionItemId: string,
  quantity: number
) => {
  const params = new URLSearchParams();
  params.append("quantity", quantity.toString());

  return stripeRequest(
    `/subscription_items/${subscriptionItemId}/usage_records`,
    {
      body: params,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};
