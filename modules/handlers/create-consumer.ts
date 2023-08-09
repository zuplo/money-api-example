import { ZuploContext, ZuploRequest } from "@zuplo/runtime";
import { createAPIKeyConsumer } from "./api-key-bucket";
import { getUserInfo } from "modules/utils/user-info";
import { ErrorResponse } from "modules/types";

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
