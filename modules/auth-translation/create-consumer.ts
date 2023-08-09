import { ZuploContext, ZuploRequest } from "@zuplo/runtime";
import { createAPIKeyConsumer } from "../handlers/api-key-bucket";

interface CreateConsumerRequestBody {
  description: string;
}

export default async function (request: ZuploRequest, context: ZuploContext) {
  const data: CreateConsumerRequestBody = await request.json();
  const userEmail = await context.custom.email;

  return await createAPIKeyConsumer({
    email: userEmail,
    description: data.description,
    stripeCustomerId: request?.user?.data?.stripeCustomerId,
  });
}
