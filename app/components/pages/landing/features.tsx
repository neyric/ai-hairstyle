import { Image } from "~/components/common";

interface Feature {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface FeaturesGridProps {
  title: string;
  subtitle: string;
  features: Feature[];
}

export default function FeaturesGrid({
  title,
  subtitle,
  features,
}: FeaturesGridProps) {
  return (
    <div className="bg-base-200 my-12 md:my-18 lg:my-24 relative">
      <div id="features" className="absolute -top-20" />
      <div className="container md:text-center my-6 md:my-12 lg:my-18">
        <h2 className="text-2xl md:text-3xl mb-2 font-bold">{title}</h2>
        <p className="text-base max-w-3xl mx-auto">{subtitle}</p>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-8 md:my-12 lg:my-16 gap-6 text-left`}
        >
          {features.map((feature, i) => (
            <div className="flex flex-row items-start gap-4" key={i}>
              <div className="w-16 h-16 bg-base-300 rounded-box flex items-center justify-center">
                {typeof feature.icon === "string" ? (
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    className="w-8 h-8"
                  />
                ) : (
                  feature.icon
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base">{feature.title}</h3>
                <p className="text-sm opacity-70">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
