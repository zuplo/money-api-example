import {
  ZuploRequest,
  ZuploContext,
  MemoryZoneReadThroughCache,
} from "@zuplo/runtime";

import { getActiveStripeSubscription } from "./stripe";
import { ErrorResponse, JsonResponse } from "../types";
import { usageBatchDispatcher } from "./batch-dispatcher";

type MeteredRequestDetails = {
  usageSubscriptionItemId: string;
};

export default async function meteredRequest(
  request: ZuploRequest,
  context: ZuploContext
): Promise<JsonResponse | ZuploRequest> {
  const stripeCustomerId = request?.user?.data?.stripeCustomerId;

  if (!stripeCustomerId) {
    return new ErrorResponse("Your are not an existing customer", 401);
  }

  // Get quota details from the cache first,
  // if not found, get it from Stripe and cache it
  const cache = new MemoryZoneReadThroughCache<MeteredRequestDetails>(
    "metered-requests-details",
    context
  );

  const cachedQuotaDetails = await cache.get(stripeCustomerId);

  let meteredRequestDetails: MeteredRequestDetails;

  if (cachedQuotaDetails) {
    meteredRequestDetails = {
      usageSubscriptionItemId: cachedQuotaDetails.usageSubscriptionItemId,
    };
  } else {
    // fetch subscription details and add to cache so next
    // time we don't have to make a request to Stripe
    try {
      const subscription = await getActiveStripeSubscription(
        stripeCustomerId,
        context.log
      );

      if (!subscription || subscription.plan.usage_type !== "metered") {
        return new ErrorResponse("You don't have a valid subscription", 401);
      }

      meteredRequestDetails = {
        usageSubscriptionItemId: subscription.items.data[0].id,
      };

      // void is used to ignore the promise so we don't block
      // the request execution, making it faster
      void cache.put(stripeCustomerId, meteredRequestDetails, 60);
    } catch (err) {
      context.log.error(err);
      return new ErrorResponse("An error happened", 500);
    }
  }

  // Batch the usage record to be sent to Stripe
  // so we don't hit Stripe's API rate limit.
  // This is also done in a fire-and-forget fashion
  // to make the request faster.
  usageBatchDispatcher.enqueue(
    meteredRequestDetails.usageSubscriptionItemId,
    context.log
  );

  // `waitUntil` ensures that the batch is flushed
  // before the instance that handles the request
  // is destroyed.
  context.waitUntil(usageBatchDispatcher.waitUntilFlushed());

  return request;
}
