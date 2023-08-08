import { ZuploContext, ZuploRequest, environment } from "@zuplo/runtime";

interface CreateConsumerRequestBody {
  description: string;
  keyPrefix: string;
  metadata: {
    [key: string]: string;
  };
}

export default async function (request: ZuploRequest, context: ZuploContext) {
  const data: CreateConsumerRequestBody = await request.json();
  const orgId = context.custom.orgId;
  const keyName = `${data.keyPrefix}-${crypto.randomUUID()}`;

  const body = {
    name: keyName,
    description: data.description,
    // typically you would store some useful metadata
    // for us in the gateway pipeline
    metadata: data.metadata,
    tags: {
      orgId,
    },
  };

  const response = await fetch(
    `${environment.BUCKET_URL}/consumers/?with-api-key=true`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${environment.ZAPI_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  return response;
}
