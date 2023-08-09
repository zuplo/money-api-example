import { getSubscription, getUsage } from "@/lib/get-subscription";
import { authOptions } from "../api/auth/[...nextauth]/auth-options";
import { KeyManager } from "./KeyManager";
import { CurrentSubscriptionUsage } from "@/components/current-subscription";
import { isLoggedInSession } from "@/lib/logged-in";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const zuploUrl = process.env.ZUPLO_URL || "";
  const session = await getServerSession(authOptions);
  const isLoggedIn = isLoggedInSession(session);

  if (!isLoggedIn) {
    return redirect("/");
  }

  const subscription = await getSubscription(session);

  if (subscription.error) {
    throw new Error(subscription.error)
  }

  const usage = await getUsage(session)

  if (usage.error) {
    throw new Error(usage.error)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="items-center">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl pb-8">
            To use the API, use the API Key manager below:
          </h1>
          <div className="my-10">
            <KeyManager
              apiUrl={zuploUrl}
              accessToken={session.accessToken}
              email={session.user.email}
            />
          </div>
          <p className="max-w-[700px] text-lg  sm:text-xl">
            Make an authenticated API request:
          </p>
          <code>
            curl &apos;{process.env.ZUPLO_URL}/v1/todos&apos; \ <br />
            --header &apos;Authorization: Bearer YOUR_KEY_HERE&apos;
          </code>
        </div>
      </section>
      <CurrentSubscriptionUsage usage={usage} />
    </div>
  );
}
