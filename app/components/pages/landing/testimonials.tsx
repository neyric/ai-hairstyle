import { Image } from "~/components/common";

interface Testimonial {
  name: string;
  content: string;
  avatar?: string;
}

export interface TestimonialsSectionProps {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

export default function TestimonialsSection({
  title,
  subtitle,
  testimonials,
}: TestimonialsSectionProps) {
  return (
    <div className="py-8 md:py-12 bg-primary/15 relative">
      <div id="testimonials" className="absolute -top-16" />
      <div className="container text-center">
        <h2 className="text-2xl md:text-3xl mb-2 font-bold">{title}</h2>
        <p className="text-base max-w-3xl mx-auto">{subtitle}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-center my-4 md:my-8 lg:my-12 gap-x-8 gap-y-4 text-left">
          {testimonials.map((testimonial, i) => (
            <div
              className="rounded-box overflow-hidden bg-white flex flex-col sm:flex-row items-center"
              key={i}
            >
              <div className="h-48 w-48 max-sm:w-full max-sm:h-40 bg-primary flex items-center justify-center">
                {testimonial.avatar && (
                  <Image
                    src={testimonial.avatar}
                    alt={`testimonial ${testimonial.name} avatar`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    wsrv={{ w: 640 }}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0 w-full p-4">
                <div className="text-base xl:text-lg font-bold">
                  {testimonial.name}
                </div>
                <div className="text-sm xl:text-base">
                  {testimonial.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
