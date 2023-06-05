import { Logger } from "@zuplo/runtime";
import { triggerMeteredSubscriptionItemUsage } from "./stripe";

/*
 * This is a generic batch dispatcher that can be used to batch
 * requests to any API. It's used in this example to batch
 * requests to Stripe's API to avoid hitting the rate limit.
 *
 * Stripe's rate limit is 100 requests per second, so we batch
 * requests to ensure we never hit that limit.
 *
 * In this example, we use two batch dispatchers:
 * - One for creating batches of usage records from multiple consumers of the API
 *   (e.g., 2 concurrent customers are making requests to the same process/isolate).
 * - Another for sending those batches to Stripe.
 */

type DispatchFunction<TPayload> = (
  batch: TPayload[],
  logger: Logger
) => Promise<void>;

class BatchDispatch<TPayload> {
  constructor(
    dispatcherName: string,
    msDelay: number,
    dispatchFunction: DispatchFunction<TPayload>
  ) {
    this.#dispatcherName = dispatcherName;
    this.#msDelay = msDelay;
    this.#dispatchFunction = dispatchFunction;
  }

  #waitingPromise: Promise<void> | undefined = undefined;
  readonly #dispatcherName: string;
  readonly #dispatchFunction: DispatchFunction<TPayload>;
  readonly #queue: TPayload[] = [];
  readonly #msDelay: number;
  #logger?: Logger;

  enqueue = (payload: TPayload, logger: Logger): void => {
    this.#queue.push(payload);
    this.#logger = logger;
    if (!this.#waitingPromise) {
      this.#waitingPromise = new Promise((res) => {
        setTimeout(async () => {
          try {
            if (this.#queue.length > 0) {
              const entries = [...this.#queue];
              this.#queue.length = 0;
              this.#waitingPromise = undefined;
              await this.#dispatchFunction(entries, logger);
            }
          } catch (error) {
            this.#logger &&
              this.#logger.error(
                `Uncaught error in BatchDispatcher named '${
                  this.#dispatcherName
                }'}`,
                error.message,
                error.stack
              );
          } finally {
            res();
          }
          // TODO - at extreme scale, we may need a max queue size
        }, this.#msDelay);
      });
    }
  };

  waitUntilFlushed = async (): Promise<void> => {
    // if we have a promise queued up, wait for that
    if (this.#waitingPromise) {
      return this.#waitingPromise;
    }
  };
}

type StripeSubscriptionItemId = string;
type TotalRequests = number;
type CustomerUsageDetails = {
  subscriptionItemId: StripeSubscriptionItemId;
  totalRequests: TotalRequests;
};

const stripeUsageUpdateDispatcher = async (
  customerUsageDetails: CustomerUsageDetails[],
  _: Logger
) => {
  // when we get here, we know that we have a batch of
  // usage records for a single subscription item
  // so we can just sum up the total requests
  const totalRequests = customerUsageDetails.reduce(
    (acc, { totalRequests }) => acc + totalRequests,
    0
  );

  // sends the usage record to stripe
  await triggerMeteredSubscriptionItemUsage(
    customerUsageDetails[0].subscriptionItemId,
    totalRequests
  );
};

// we send request to Stripe in batches of 20 miliseconds
// which means we can send 50 requests per second
// (Stripe's rate limit is 100 requests per second)
const stripeDispatcher = new BatchDispatch<CustomerUsageDetails>(
  "stripe-usage-update-dispatcher",
  20,
  stripeUsageUpdateDispatcher
);

const customerBatchDispatcher = async (
  stripeCustomerIds: StripeSubscriptionItemId[],
  logger: Logger
) => {
  const customersTotalRequests = new Map<
    StripeSubscriptionItemId,
    TotalRequests
  >();

  stripeCustomerIds.map((stripeCustomerId) => {
    const currentTotal = customersTotalRequests.get(stripeCustomerId) ?? 0;
    customersTotalRequests.set(stripeCustomerId, currentTotal + 1);
  });

  const customerUsageDetails = Array.from(customersTotalRequests.entries()).map(
    ([subscriptionItemId, totalRequests]) => ({
      subscriptionItemId,
      totalRequests,
    })
  );

  for (const customerUsageDetail of customerUsageDetails) {
    stripeDispatcher.enqueue(customerUsageDetail, logger);
  }
  await stripeDispatcher.waitUntilFlushed();
};

export const usageBatchDispatcher = new BatchDispatch<StripeSubscriptionItemId>(
  "consumer-usage-batch-dispatcher",
  100,
  customerBatchDispatcher
);
