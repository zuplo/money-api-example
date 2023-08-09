import { LoggedInSession } from "./logged-in";
import { getRequiredEnvVar } from "./utils";

export const getSubscription = async (session: LoggedInSession) => {
  const subscriptionRequest = await fetch(
    `${getRequiredEnvVar("ZUPLO_URL")}/v1/subscription`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  const subscriptionJson = await subscriptionRequest.json();

  return subscriptionJson;
};

export const getUsage = async (session: LoggedInSession) => {
  const usageRequest = await fetch(
    `${getRequiredEnvVar("ZUPLO_URL")}/v1/subscription/usage`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  const usageJson = await usageRequest.json();

  return usageJson;
};
