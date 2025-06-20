import { Image } from "~/components/common";

export interface CTASectionProps {
  title: string;
  subtitle?: string;
  userCount?: string;
  buttonText: string;
  onButtonClick?: () => void;
  testimonialAvatars: string[];
}

export default function CTASection({
  title,
  subtitle,
  userCount,
  buttonText,
  onButtonClick,
  testimonialAvatars,
}: CTASectionProps) {
  return (
    <div className="bg-base-200 relative">
      <div id="cta" className="absolute -top-20" />
      <div className="container text-center my-6 md:my-12 lg:my-18">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>

        {subtitle && (
          <h3 className="text-lg md:text-xl font-bold">{subtitle}</h3>
        )}

        <div className="flex flex-col items-center justify-center gap-y-2 my-8">
          <div className="avatar-group -space-x-4">
            {testimonialAvatars.slice(0, 5).map((img, i) => (
              <div className="avatar" key={i}>
                <div className="w-10 h-10 sm:w-12 sm:h-12">
                  <Image
                    src={img}
                    wsrv={{ w: 72 }}
                    loading="lazy"
                    alt="testimonial avtars"
                  />
                </div>
              </div>
            ))}
          </div>

          {userCount && (
            <p className="text-base">
              <span className="text-primary">{userCount}</span> have already
              tried AI hairstyle try on
            </p>
          )}

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div className="mask mask-star-2 bg-orange-400 w-6 h-6" key={i} />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            className="btn btn-primary btn-wide btn-lg"
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
