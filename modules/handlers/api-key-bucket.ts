import { environment } from "@zuplo/runtime";

export const getAPIKeyConsumer = async ({ email }: { email: string }) => {
  const response = await fetch(
    `${environment.BUCKET_URL}/consumers/?include-api-keys=true&key-format=visible&tag.email=${email}`,
    {
      headers: {
        authorization: `Bearer ${environment.ZAPI_KEY}`,
        "content-type": "application/json",
      },
    }
  );

  return response;
};

export const createAPIKeyConsumer = async ({
  email,
  description,
  stripeCustomerId,
}) => {
  const keyPrefix = email.replace(/[@.]/g, "-");
  const keyName = `${keyPrefix}-${crypto.randomUUID()}`;

  const body = {
    name: keyName,
    description: description,
    metadata: {
      stripeCustomerId,
    },
    tags: {
      email,
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
};
