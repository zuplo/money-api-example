# Zuplo Todo Sample

This is a simple [Zuplo](https://zuplo.com) sample Todo list API.

### Fork this repositoy

[Fork](https://github.com/zuplo/money-api-example/fork) the repository as you will need to connect Zuplo to your own repository.

### Create an API Gateway with Zuplo

The project you just forked contains configuration for the Zuplo API Gateway.

You can find the OpenAPI definition for a ToDo API under `config/routes.oas.json` which will be used by Zuplo to create the documentation of your API and also configure the routes to set-up API Key authentication and custom code to allow for monetizing your API directly from your API Gateway.

Under `/modules/monetization` you'll find a custom Zuplo Policy that we wrote which receives a requests and triggers user billing with Stripe.

The backend for this app can live anywhere and be written in any language, but in this example for simplicity we've used https://jsonplaceholder.typicode.com

Steps: 

1. Create an account with Zuplo: http://zuplo.com

2. Create a Zuplo project from the template that you just forked

![Create Project in Zuplo](./assets/zuplo-create-project.png)

### Setup login with Auth0

Auth0 is used to enable authentication _for the web-app only_ using social providers like Google, or email/password. This is to secure users that are logging into the website and **not** to the API. For the API, your users will be able to issue an API Key using the Developer Portal created with Zuplo.

Steps:

1. Create and account and log-in in Autho [https://auth0.com](https://auth0.com)

2. Create an Application

![Create Auth0 App](./assets/auth0-create-account.png)

3. In the _Settings_ tab, update the _Allowed Callback URLs_ field. You'll add the domains that your app authentication will work with, using comma separated values:

![Set up Allowed Callback URL](./assets/auth0-allowed-callback-url.png)

```
http://localhost:3000/api/auth/callback/auth0, https://$MY_APP_DOMAIN/api/auth/callback/auth0
```
4. Copy the environment values you'll use in your APP

![Copy Credentials values from Settings](./assets/auth0-credential-values.png)

Your env file will look like this: 

```
# .env file
AUTH0_ISSUER=https://dev-ci7vajyawp0svo51.us.auth0.com
AUTH0_CLIENT_ID=RXnCGWrH2Pl5REDACTED
AUTH0_CLIENT_SECRET=REDACTED
```
