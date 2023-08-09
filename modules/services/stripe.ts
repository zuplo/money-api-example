import { Logger } from "@zuplo/runtime";
import { environment } from "@zuplo/runtime";
import { ErrorResponse } from "modules/types";

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

type StripeCustomer = {
  id: string;
};

enum GetStripeDetailsErrorResponse {
  NotPayingCustomer = "You are not a paying customer... yet?",
  NoSubscription = "You don't have an active subscription.",
  NoUsage = "You don't have any usage for your subscription in Stripe",
}

export const getStripeCustomer = async (
  email: string
): Promise<StripeCustomer | ErrorResponse> => {
  try {
    const customerSearchResult = await stripeRequest(
      `/v1/customers?email=${email}`
    );

    if (customerSearchResult.data.length === 0) {
      console.warn("User not found in Stripe", email);
      return new ErrorResponse(GetStripeDetailsErrorResponse.NotPayingCustomer);
    }

    return customerSearchResult.data[0] as StripeCustomer;
  } catch (err) {
    console.error(err);
    return new ErrorResponse(
      "An error happened while looking for your subscription",
      500
    );
  }
};

type ActiveStripeSubscriptions = {
  id: string;
  plan: {
    usage_type: "metered" | "licensed";
  };
  items: {
    data: {
      id: string;
    }[];
  };
};

export const getStripeSubscriptionByEmail = async ({
  customerEmail,
  logger,
}: {
  customerEmail: string;
  logger: Logger;
}): Promise<ActiveStripeSubscriptions | ErrorResponse> => {
  const stripeCustomer = await getStripeCustomer(customerEmail);

  if (stripeCustomer instanceof ErrorResponse) {
    logger.warn("customer not found in stripe", {
      customerEmail,
    });
    return stripeCustomer;
  }

  const activeSubscription = await getActiveStripeSubscription({
    stripeCustomerId: stripeCustomer.id,
    logger,
  });

  return activeSubscription;
};

export const getActiveStripeSubscription = async ({
  stripeCustomerId,
  logger,
}: {
  stripeCustomerId: string;
  logger: Logger;
}): Promise<ActiveStripeSubscriptions | ErrorResponse> => {
  const customerSubscription = await stripeRequest(
    "/subscriptions?customer=" + stripeCustomerId + "&status=active&limit=1"
  );

  if (customerSubscription.data.length === 0) {
    logger.warn("customer has no subscription", {
      stripeCustomerId,
    });
    return new ErrorResponse(GetStripeDetailsErrorResponse.NoSubscription);
  }

  if (
    !customerSubscription.data[0].plan ||
    customerSubscription.data[0].status !== "active"
  ) {
    logger.warn("customer has no active subscription plan", {
      stripeCustomerId,
    });
    return new ErrorResponse(GetStripeDetailsErrorResponse.NoSubscription);
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