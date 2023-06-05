export const StripeSubscriptionTable = () => {
  return (
    <>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Subscribe to our API and start
            <br className="hidden sm:inline" />
            now the change of your life.
          </h1>
          <p className="text-muted-foreground max-w-[700px] text-lg  sm:text-xl">
            The fastest way to get what you need.
          </p>
        </div>
      </section>
      <div
        dangerouslySetInnerHTML={{
          __html: `
              <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
                <stripe-pricing-table pricing-table-id="prctbl_1NDvt1G5nE8RSfGyUeCkTdIZ"
                publishable-key="pk_test_51HWUYJG5nE8RSfGywgJ3pwfcC9m4Hiic2QejxjU3mehsrUHBIzmLlZuMJGHeZ7JfKjN5Kmxn5d1FnsOB9tFUejeV00f5HIW9Bk">
              </stripe-pricing-table>
            `,
        }}
      />
    </>
  );
};
