# Money API Example

This is a repository containing a sample application that shows how to monetize your APIs using Zuplo.

It uses the following technologies:

- [Zuplo](https://zuplo.com) - API Gateway
- [Stripe](https://stripe.com) - Payment Processor
- [Auth0](https://auth0.com) - Authentication Provider
- [Vercel](https://vercel.com) - Web App Hosting

## How it works

This example shows how to monetize an API using Zuplo. It uses a simple ToDo API as an example.

Zuplo is used by companies that want to ship production-ready APIs to their customers. It offers beautiful Developer Docs, API Key authentication, rate-limiting and more.

This sample application consists of 3 parts:

- A Zuplo API Gateway that secures your API and allows you to monetize it
- A simple web-app using [NextJS](https://nextjs.org) that allows users to sign up and subscribe to your API
- A Stripe subscription product that allows your users to pay for the exact number of requests they make to your API

![Money API Components](./assets/money-api-components.png)

Your customers will be able to sign up to use your API using the web-app and make requests to your API using an API Key that they can generate in the Zuplo Developer Portal.

## Getting Started

[Fork](https://github.com/zuplo/money-api-example/fork) the repository as you will need to connect Zuplo to your own repository.

### Step 1 - Deploy the web-app to Vercel

The web-app is an example used to create a portal where users can sign up and subscribe to your API.

> The deployment will not work until all the steps in this guide are completed but you will get the deployment URL which is needed in the next steps

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzuplo%2Fmoney-api-example%2Ftree%2Fmain%2Fdashboard&project-name=money-api&demo-title=Money%20API&demo-description=Monetize%20your%20APIs%20in%2010%20minutes.&demo-url=https%3A%2F%2Fmoney-api.zuplo.com)

### Step 2 - Setup web-app login with Auth0

Auth0 is used to enable authentication _for the web-app only_ using social providers like Google, or email/password. This is to secure users that are logging into the website and **not** to the API. For the API, your users will be able to issue an API Key using the Developer Portal created with Zuplo.

Steps:

1. **Create and account and log-in in Autho [https://auth0.com](https://auth0.com)**

2. **Create an Application**

![Create Auth0 App](./assets/auth0-create-account.png)

3. **In the _Settings_ tab, update the _Allowed Callback URLs_ field. You'll add the domains that your app authentication will work with, using comma separated values**:

![Set up Allowed Callback URL](./assets/auth0-allowed-callback-url.png)

```
http://localhost:3000/api/auth/callback/auth0, https://$MY_APP_DOMAIN/api/auth/callback/auth0
```

4. **Copy the environment values you'll use in your APP**

![Copy Credentials values from Settings](./assets/auth0-credential-values.png)

Your env file will look like this:

```
# .env file
AUTH0_ISSUER=https://dev-ci7vajyawp0svo51.us.auth0.com
AUTH0_CLIENT_ID=RXnCGWrH2Pl5REDACTED
AUTH0_CLIENT_SECRET=REDACTED
```

### Step 3 - Create a Stripe Subscription Product

Stripe is used to manage the subscription of your users to your API. In this section, you will create a Stripe subscription product to allow your users to "pay as they go" and bill them for the exact number of requests that they made in a period of time.

Steps:

1. **Log in to Stripe https://stripe.com (if you're creating a new account, you can skip the section of _Activate payments on your account_)**

2. **Create a subscription Product**

![Stripe Add Product Step 1](./assets/stripe-add-product.png)

![Stripe Add Product Step 2](./assets/stripe-add-product-step-2.png)

3. **Create a Pricing Table to embed on the web-app**

Go back to _Product_ page.

![](./assets/stripe-add-pricing-table.png)

![](./assets/stripe-add-pricing-table-2.png)

Make sure to set the checkout redirect to the deployed web-app domain:

![](./assets/stripe-add-pricing-table-3.png)

4. **Add the Pricing table to your website**

Copy the Pricing Table and paste in [`/dashboard/components/stripe-pricing-table.tsx`](./dashboard/components/stripe-pricing-table.tsx)

![](./assets/stripe-add-pricing-table-4.png)

```diff
<div
  dangerouslySetInnerHTML={{
    __html: `
-        YOUR SUBSCRIPTION TABLE HERE
+        <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
+        <stripe-pricing-table pricing-table-id="prctbl_1234ABC" publishable-key="pk_test_1234ABC">
+        </stripe-pricing-table>
      `,
  }}
/>
```

5. **Save your Stripe Secret Key**

![](./assets/stripe-get-secret-key.png)

```
# .env
STRIPE_SECRET_KEY=sk...
```

### Step 4 - Add an API Gateway to your API with Zuplo

The project you just forked contains configuration for the Zuplo API Gateway.

You can find the OpenAPI definition for a ToDo API under `config/routes.oas.json` which will be used by Zuplo to create the documentation of your API and also configure the routes to set-up API Key authentication and custom code to allow for monetizing your API directly from your API Gateway.

Under `/modules/monetization` you'll find a custom Zuplo Policy that we wrote which receives a requests and triggers user billing with Stripe.

The backend for this app can live anywhere and be written in any language, but in this example for simplicity we've used https://jsonplaceholder.typicode.com

Steps:

1. **Create an account with Zuplo**: http://zuplo.com

2. **Create a Zuplo project from the template that you just forked**

![Create Project in Zuplo](./assets/zuplo-create-project.png)

3. **Get Zuplo-related environment variables**

These environment variables are needed to programatically create a Zuplo API Key using the [Zuplo Dev API](https://dev.zuplo.com) for your users as soon as they finish the checkout process in your web-app.

Make sure to copy the _Current Env URL_ and not the Production URL for now.

![](./assets/zuplo-project-settings.png)

```sh
# .env
ZUPLO_URL=https://teal-hornet-main-f515e70.d2.zuplo.dev
ZUPLO_PROJECT_ID=teal-hornet
ZUPLO_ACCOUNT_ID=plum_everyday_squirrel
ZUPLO_KEY_BUCKET=zprj-123ABC-working-copy
```

4. **Get Zuplo Dev API secret key**

You can find this in your Accounts Settings page in Zuplo.

![](./assets/zuplo-api-key.png)

```
# .env
ZUPLO_API_KEY=zpka_...
```

## Step 5 - Update the Environment Variables of your Web-App

Now that you have all the environment variables of your account, you can update the environment variables in Vercel to make your web-app work.

![](./assets/vercel-update-envs.png)

You will to trigger an empty deployment to make sure that the environment variables are updated.

```sh
git commit --allow-empty -m "Trigger empty deployment to update envs"
git push
```

## Step 6 - Try it out!

You can now go through the flow of signing up to your API, creating an API Key, and making requests to your API.

While signing up with Stripe, you can use [Test Credit Cards](https://stripe.com/docs/testing) to simulate the payment flow.

Go make some money!

![](./assets/money-api-ready.png)
