import { Fragment, useRef } from "react";

import HeroSection, { type HeroSectionProps } from "./hero";
import HowItWorksSection, { type HowItWorksSectionProps } from "./how-it-works";
import FeaturesGrid, { type FeaturesGridProps } from "./features";
import PricingCards, { type PricingCardsProps } from "./pricing";
import AlternatingContentSection, {
  type AlternatingContentSectionProps,
} from "./alternating-content";
import CTASection, { type CTASectionProps } from "./cta";
import TestimonialsSection, {
  type TestimonialsSectionProps,
} from "./testimonials";
import FAQSection, { type FAQSectionProps } from "./faqs";

export interface LandingProps {
  hero: Omit<HeroSectionProps, "openRef">;
  howItWorks: HowItWorksSectionProps;
  features: FeaturesGridProps;
  pricing: PricingCardsProps;
  alternatingContent: AlternatingContentSectionProps;
  cta: CTASectionProps;
  testimonials: TestimonialsSectionProps;
  faqs: FAQSectionProps;
  openRef?: HeroSectionProps["openRef"];
  onFileUpload?: (file: File) => void;
  onCTAClick?: () => void;
}

export default function Landing({
  hero,
  howItWorks,
  features,
  pricing,
  alternatingContent,
  cta,
  testimonials,
  faqs,
  openRef,
  onFileUpload,
  onCTAClick,
}: LandingProps) {
  return (
    <Fragment>
      <HeroSection {...hero} onUpload={onFileUpload} openRef={openRef} />
      <HowItWorksSection {...howItWorks} />
      <FeaturesGrid {...features} />
      <PricingCards {...pricing} />
      <AlternatingContentSection {...alternatingContent} />
      <CTASection {...cta} onButtonClick={onCTAClick} />
      <TestimonialsSection {...testimonials} />
      <FAQSection {...faqs} />
    </Fragment>
  );
}
