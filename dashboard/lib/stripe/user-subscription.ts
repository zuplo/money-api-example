import { Err, Ok, Result } from "@zondax/ts-results";

const stripeAPIKey = process.env.STRIPE_SECRET_KEY;

const stripeRequest = async (path: string) => {
  const request = await fetch("https://api.stripe.com" + path, {
    headers: {
      Authorization: `Bearer ${stripeAPIKey}`,
    },
  });

  return await request.json();
};

type StripeCustomer = {
  id: string;
};

export async function getStripeCustomer(email: string) {
  try {
    const customerSearchResult = await stripeRequest(
      `/v1/customers?email=${email}`
    );

    if (customerSearchResult.data.length === 0) {
      console.warn("User not found in Stripe", email);
      return null;
    }

    return customerSearchResult.data[0] as StripeCustomer;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getCustomerSubscription(stripeCustomerId: string) {
  const supbscriptionPlan = await stripeRequest(
    "/v1/subscriptions?customer=" + stripeCustomerId + "&status=active&limit=1"
  );

  if (supbscriptionPlan.data.length === 0) {
    return null;
  }

  return supbscriptionPlan.data[0];
}

export async function getSubscriptionItemUsage(subscriptionItemId: string) {
  const subscriptionItemUsageRecords = await stripeRequest(
    "/v1/subscription_items/" + subscriptionItemId + "/usage_record_summaries"
  );

  if (subscriptionItemUsageRecords.data.length === 0) {
    return null;
  }

  return subscriptionItemUsageRecords.data[0];
}

export async function getProductById(productId: string) {
  return await stripeRequest("/v1/products/" + productId);
}

export type StripeActiveSubscription = {
  product: {
    name: string;
    metadata: {
      maxRequestsAllowed: number;
    };
  };
  usage?: {
    total_usage: number;
  };
};

enum GetStripeSubscriptionByEmailError {
  NotPayingCustomer = "You are not a paying customer... yet?",
  NoSubscription = "You don't have a subscription in Stripe",
  NoProduct = "You don't have a product in Stripe",
  NoUsage = "You don't have any usage for your subscription in Stripe",
}

export const getStripeSubscriptionByEmail = async (
  customerEmail: string
): Promise<
  Result<StripeActiveSubscription, GetStripeSubscriptionByEmailError>
> => {
  const stripeCustomer = await getStripeCustomer(customerEmail);

  if (stripeCustomer === null) {
    return Err(GetStripeSubscriptionByEmailError.NotPayingCustomer);
  }

  const customerSubscription = await getCustomerSubscription(stripeCustomer.id);

  if (customerSubscription === null) {
    return Err(GetStripeSubscriptionByEmailError.NoSubscription);
  }

  const product = await getProductById(customerSubscription.plan.product);

  if (!product) {
    return Err(GetStripeSubscriptionByEmailError.NoProduct);
  }

  if (customerSubscription.plan.usage_type === "metered") {
    const subscriptionItemId = customerSubscription.items.data[0].id;

    const subscriptionItemUsage = await getSubscriptionItemUsage(
      subscriptionItemId
    );

    if (subscriptionItemUsage === null) {
      return Err(GetStripeSubscriptionByEmailError.NoUsage);
    }

    return Ok({
      usage: subscriptionItemUsage,
      product,
    });
  }

  return Ok({
    product,
  });
};
