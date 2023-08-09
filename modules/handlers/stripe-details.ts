import { ZuploContext, ZuploRequest } from "@zuplo/runtime";
import { getUserInfo } from "modules/auth-translation/data";
import { getStripeSubscriptionByEmail } from "modules/services/stripe";
import { ErrorResponse } from "modules/types";

export async function stripeSubscription(
  request: ZuploRequest,
  context: ZuploContext
) {
  const userInfo = await getUserInfo(request, context);

  if (userInfo instanceof ErrorResponse) {
    return userInfo;
  }

  return await getStripeSubscriptionByEmail({
    customerEmail: userInfo.email,
    logger: context.log,
  });
}
