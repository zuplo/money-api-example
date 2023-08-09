import { ZuploContext, ZuploRequest } from "@zuplo/runtime";
import { getUserInfo } from "../utils/user-info";
import { getStripeSubscriptionByEmail } from "../services/stripe";
import { ErrorResponse } from "../types";

export default async function stripeActiveSubscription(
  request: ZuploRequest,
  context: ZuploContext
) {
  const userInfo = await getUserInfo(request, context);

  if (userInfo instanceof ErrorResponse) {
    return userInfo;
  }

  const stripeSubscription = await getStripeSubscriptionByEmail({
    request,
    context,
  });

  if (stripeSubscription instanceof ErrorResponse) {
    return stripeSubscription;
  }

  return request;
}
