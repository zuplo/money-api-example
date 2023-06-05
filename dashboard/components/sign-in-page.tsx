import { SignInButton } from "./sign-in-button";

export const SignInPage = () => {
  return (
    <div className="flex flex-col">
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Money API: Where APIs meet 💸
          </h1>
          <p className="text-muted-foreground max-w-[700px] text-lg  sm:text-xl">
            The fastest way to get the car with wing doors.
          </p>
        </div>
      </section>
      <div className="flex w-full items-center justify-center">
        <SignInButton />
      </div>
    </div>
  );
};
