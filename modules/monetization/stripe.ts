import { Logger } from "@zuplo/runtime";

const stripeAPIKey =
  "sk_test_51HWUYJG5nE8RSfGymCAgTXxgErfZW1AsuiEa1I0MT4SJ4wTXsQJkkYbjomAU6n04zkUke6CWx8OaLnwJQmHzWEfY004WsQYOnH";

export const stripeRequest = async (path: string, options?: RequestInit) => {
  return fetch("https://api.stripe.com/v1" + path, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${stripeAPIKey}`,
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
    customerSubscription.status !== "active"
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
