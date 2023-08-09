import { ZuploContext, ZuploRequest } from "@zuplo/runtime";
import { createAPIKeyConsumer, getAPIKeyConsumer } from "./api-key-bucket";
import { getUserInfo } from "../utils/user-info";
import { ErrorResponse } from "../types";

interface CreateConsumerRequestBody {
  description: string;
}

export async function createConsumer(request: ZuploRequest, context: ZuploContext) {
  const data: CreateConsumerRequestBody = await request.json();
  const userInfo = await getUserInfo(request, context);

  if (userInfo instanceof ErrorResponse) {
    return userInfo;
  }

  return await createAPIKeyConsumer({
    email: userInfo.email,
    description: data.description,
    stripeCustomerId: request?.user?.data?.stripeCustomerId,
  });
}

export async function getConsumers(request: ZuploRequest, context: ZuploContext) {
  const userInfo = await getUserInfo(request, context);

  if (userInfo instanceof ErrorResponse) {
    return userInfo;
  }

  return await getAPIKeyConsumer({
    email: userInfo.email,
  });
}
