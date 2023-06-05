import { authOptions } from "../api/auth/[...nextauth]/auth-options";
import { CurrentSubscription } from "@/components/current-subscription";
import { isLoggedInSession } from "@/lib/logged-in";
import { getStripeSubscriptionByEmail } from "@/lib/stripe/user-subscription";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const zuploUrl = process.env.ZUPLO_URL;
  const session = await getServerSession(authOptions);
  const isLoggedIn = isLoggedInSession(session);

  if (!isLoggedIn) {
    return redirect("/");
  }

  const customerSubscription = await getStripeSubscriptionByEmail(
    session.user.email
  );

  if (!customerSubscription.ok) {
    redirect("/");
  }

  return (
    // center the content
    <div className="flex flex-col items-center justify-center">
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="items-center">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl pb-8">
            To use the API follow the instructions below.
          </h1>
          <p className="max-w-[700px] text-lg  sm:text-xl">
            Go to{" "}
            <Link
              href={zuploUrl + "/docs"}
              target="_blank"
              className="text-blue-500"
            >
              our API docs
            </Link>{" "}
            and sign in
          </p>
          <Image src="/docs-signin.png" width="700" height="500" alt="docs" />
          <p className="max-w-[700px] text-lg sm:text-xl">
            Once logged in, click on <code>Create Key</code>:
          </p>
          <Image
            src="/bucket-create-key.png"
            width="700"
            height="500"
            alt="create key"
          />
          <p className="max-w-[700px] text-lg  sm:text-xl">
            Make an authenticated API request:
          </p>
          <code>
            curl --request GET \ --url
            <br />
            https://teal-hornet-main-79f7919.zuplo.app/v1/todos \ --header{" "}
            <br />
            &apos;Authorization: Bearer YOUR_KEY_HERE&apos;
          </code>
        </div>
      </section>
      <CurrentSubscription customerSubscription={customerSubscription.val} />
    </div>
  );
}
