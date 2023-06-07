export const StripePricingTable = () => {
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
              YOUR SUBSCRIPTION TABLE HERE
            `,
        }}
      />
    </>
  );
};
