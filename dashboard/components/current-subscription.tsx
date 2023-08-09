export const CurrentSubscriptionUsage = ({
  usage,
}: {
  usage: {
    total_usage: number;
  }
}) => {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <p>
        You have made <b>{usage.total_usage}</b> requests
        this month
      </p>
    </div>
  );
};
