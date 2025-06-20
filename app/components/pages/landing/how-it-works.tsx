import { Image } from "~/components/common";

interface Step {
  title: string;
  description: string;
}

export interface HowItWorksSectionProps {
  title: string;
  subtitle: string;
  steps: Step[];
  cover?: string;
}

export default function HowItWorksSection({
  title,
  subtitle,
  steps,
  cover: imageUrl,
}: HowItWorksSectionProps) {
  return (
    <div className="py-8 md:py-12 bg-primary/15 relative">
      <div id="how-it-works" className="absolute -top-16" />
      <div className="container text-center">
        <h2 className="text-2xl md:text-3xl mb-2 font-bold">{title}</h2>
        <p className="text-base max-w-3xl mx-auto">{subtitle}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-center my-4 md:my-8 lg:my-12 gap-x-8 gap-y-4">
          <div className="w-full aspect-[4/3] bg-white rounded-box">
            {imageUrl && (
              <Image
                src={imageUrl}
                loading="lazy"
                alt="How AI Hairstyle it works"
                className="w-full h-full object-cover rounded-box"
                wsrv={{ w: 736 }}
              />
            )}
          </div>

          <ul className="list text-left">
            {steps.map((step, i) => (
              <li className="list-row" key={i}>
                <div className="text-2xl md:text-4xl font-thin tabular-nums">
                  0{i + 1}
                </div>
                <div className="list-col-grow">
                  <h3 className="font-bold">{step.title}</h3>
                  <p className="text-sm">{step.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
