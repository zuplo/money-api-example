import { ZuploContext, ZuploRequest } from "@zuplo/runtime";
import { getUserInfo } from "./data";
import { ErrorResponse } from "modules/types";
import { createAPIKeyConsumer } from "modules/handlers/api-key-bucket";

interface CreateConsumerRequestBody {
  description: string;
}

export default async function (request: ZuploRequest, context: ZuploContext) {
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
