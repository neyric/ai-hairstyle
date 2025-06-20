interface PricingPlan {
  title: string;
  badge: string;
  badgeColor: "primary" | "accent" | "secondary";
  description: string;
  buttonText: string;
  footerText: React.ReactNode;
  loading?: boolean;
  onButtonClick?: () => void;
}

export interface PricingCardsProps {
  title: string;
  subtitle: string;
  plans: PricingPlan[];
}

export default function PricingCards({
  title,
  subtitle,
  plans,
}: PricingCardsProps) {
  return (
    <div className="container md:text-center my-12 md:my-18 lg:my-24 relative">
      <div id="pricing" className="absolute -top-20" />
      <h2 className="text-2xl md:text-3xl mb-2 font-bold">{title}</h2>
      <p className="text-base max-w-3xl mx-auto">{subtitle}</p>

      <div className="my-8 md:my-12 lg:my-16 grid grid-cols-1 md:grid-cols-2 max-w-4xl w-full mx-auto gap-4 text-left">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="card bg-base-100 card-border border-base-300"
          >
            <div className="card-body">
              <div
                className={`badge data-[color=primary]:badge-primary data-[color=accent]:badge-accent data-[color=secondary]:badge-secondary badge-soft`}
                data-color={plan.badgeColor}
              >
                <div
                  className={`mask mask-heart w-4 h-4 data-[color=primary]:bg-primary data-[color=accent]:bg-accent data-[color=secondary]:bg-secondary`}
                  data-color={plan.badgeColor}
                />
                {plan.badge}
              </div>

              <h3 className="text-lg font-bold mt-2">{plan.title}</h3>
              <p className="text-base">{plan.description}</p>
              <div className="grow" />
              <div className="mt-8 md:mt-12">
                <button
                  className="btn btn-primary btn-block mb-1 data-[loading=true]:cursor-not-allowed"
                  onClick={plan.loading ? undefined : plan.onButtonClick}
                  data-loading={plan.loading}
                >
                  <span
                    className="loading loading-spinner hidden data-[loading=true]:block"
                    data-loading={plan.loading}
                  />
                  {plan.buttonText}
                </button>

                {typeof plan.footerText === "string" ? (
                  <p className="text-center opacity-60">{plan.footerText}</p>
                ) : (
                  <div className="text-center opacity-60">
                    {plan.footerText}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
