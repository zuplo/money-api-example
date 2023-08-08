"use client";

import FullScreenLoading from "@/components/full-screen-loading";
import ApiKeyManager, {
  Consumer,
  DefaultApiKeyManagerProvider,
} from "@zuplo/react-api-key-manager";
import { useCallback, useMemo, useState } from "react";

interface Props {
  apiUrl: string;
  accessToken: string;
  stripeCustomerId: string;
  email: string;
}

export function KeyManager({
  apiUrl,
  accessToken,
  stripeCustomerId,
  email,
}: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [showIsLoading, setShowIsLoading] = useState(false);

  const provider = useMemo(() => {
    return new DefaultApiKeyManagerProvider(apiUrl, accessToken);
  }, [apiUrl, accessToken]);

  const createConsumer = useCallback(
    async (description: string) => {
      try {
        setIsCreating(true);

        const response = await fetch(`${apiUrl}/consumers/my`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            keyPrefix: email.replace(/[@.]/g, "-"),
            description,
            metadata: {
              stripeCustomerId: stripeCustomerId,
            },
          }),
        });

        // TODO - we should have better error handling without alerts, but ok for v1
        if (response.status !== 200) {
          const text = await response.text();
          throw new Error(text);
        }

        provider.refresh();
      } catch (e) {
        console.error(e);
        alert(`Error creating key: ${e}`);
      } finally {
        setIsCreating(false);
      }
    },
    [provider]
  );

  const deleteConsumer = useCallback(
    async (consumerName: string) => {
      try {
        setShowIsLoading(true);
        await provider.deleteConsumer(consumerName);
        provider.refresh();
      } catch (err) {
        // TODO
        throw err;
      } finally {
        setShowIsLoading(false);
      }
    },
    [provider]
  );

  function clickCreateConsumer() {
    const desc = window.prompt("Enter a description for your new API Key");
    if (desc) {
      createConsumer(desc);
    }
  }

  const menuItems = useMemo(() => {
    return [
      {
        label: "Delete",
        action: async (consumer: Consumer) => {
          await deleteConsumer(consumer.name);
        },
      },
    ];
  }, [deleteConsumer]);

  if (isCreating) {
    return <FullScreenLoading />;
  }

  return (
    <div>
      <ApiKeyManager
        provider={provider}
        menuItems={menuItems}
        showIsLoading={showIsLoading}
      />
      <button
        onClick={clickCreateConsumer}
        className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg flex flex-row items-center"
      >
        Create new API Key
      </button>
    </div>
  );
}
