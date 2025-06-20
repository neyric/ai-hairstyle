import type { Route } from "./+types/route";

import { useRef, Fragment, useMemo, useState, useCallback } from "react";
import { useUser } from "~/store";

import {
  BookImage,
  Globe,
  GalleryHorizontalEnd,
  Bot,
  ShieldUser,
  BadgeDollarSign,
} from "lucide-react";

import Landing, { type LandingProps } from "~/components/pages/landing";
import {
  HairstyleChanger,
  type HairstyleChangerRef,
} from "~/features/hairstyle_changer";

import { createCanonical } from "~/utils/meta";
import { hairstyles, colors, hairtypes } from "./config";
import { CREDITS_PRODUCT } from "~/.server/constants";

export function meta({ matches }: Route.MetaArgs) {
  const canonical = createCanonical("/", matches[0].data.DOMAIN);

  return [
    { title: "AI Hairstyle Changer: Try Virtual Haircuts & Hair Colors" },
    {
      name: "description",
      content:
        "Preview your next haircut with the AI Hairstyle Changer. Upload a photo to try on virtual hairstyles and colors instantly, realistic, fun, and risk-free.",
    },
    canonical,
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { hairstyles, colors, hairtypes, product: CREDITS_PRODUCT };
}

export default function Home({
  loaderData: { hairstyles, colors, hairtypes, product },
}: Route.ComponentProps) {
  const [requestPayment, setRequestPayment] = useState(false);
  const user = useUser((state) => state.user);

  const openRef = useRef(() => {});
  const changerRef = useRef<HairstyleChangerRef>(null);

  const handleUpload = useCallback(() => {
    openRef.current();
    if (window) window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBuyCredits = useCallback(async () => {
    if (!window) return;
    setRequestPayment(true);

    const res = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify(product),
    }).finally(() => setRequestPayment(false));

    if (res.ok) {
      const data = await res.json<{ checkout_url: string }>();
      location.href = data.checkout_url;

      return;
    }

    if (res.status === 401) {
      document.querySelector<HTMLButtonElement>("#google-oauth-btn")?.click();
    }
  }, [user]);

  const pageData = useMemo<LandingProps>(() => {
    return {
      hero: {
        title: "Try-on Hairstyle \nwith the power of AI",
        description:
          "Wondering how you'd look with a new haircut? AI Hairstyle lets you try it out virtually, no scissors needed. Upload a photo and explore fresh styles in mintues!",
        buttonText: "Upload your photo now",
        dropHintText: "or drop a file here",
        exampleHintText: "Or try with example",
        secondaryDescription:
          "Trying a new hairstyle just got way easier. Whether you're thinking about a trim or a total makeover, AI hairstyle helps you see it first, so you can walk into the salon with confidence.",
        testimonialText:
          "Thousands who’ve already reimagined their look with AI Hairstyle. Try your new hairstyles today.",
        diffImages: [
          "https://cdn.hairroom.app/assets/images/diff-before.webp",
          "https://cdn.hairroom.app/assets/images/diff-after.webp",
        ],
        exampleImages: [
          "https://cdn.hairroom.app/assets/images/example-men-1.webp",
          "https://cdn.hairroom.app/assets/images/example-men-2.webp",
          "https://cdn.hairroom.app/assets/images/example-women-1.webp",
          "https://cdn.hairroom.app/assets/images/example-women-2.webp",
        ],
        testimonialAvatars: [
          "https://cdn.hairroom.app/assets/images/testimonial-1.webp",
          "https://cdn.hairroom.app/assets/images/testimonial-2.webp",
          "https://cdn.hairroom.app/assets/images/testimonial-3.webp",
          "https://cdn.hairroom.app/assets/images/testimonial-4.webp",
          "https://cdn.hairroom.app/assets/images/testimonial-5.webp",
        ],
      },
      howItWorks: {
        title: "How It Works",
        subtitle:
          "Discover your perfect look and preview AI hairstyles in mintues with just one photo",
        cover: "https://cdn.hairroom.app/assets/images/how-it-works.webp",
        steps: [
          {
            title: "Upload your selfie",
            description:
              "For the best AI results, use a clear photo, face forward, good lighting, and hair pulled back if possible.",
          },
          {
            title: "Pick your hairstyles",
            description:
              "Browse or filter by length, type, or vibe. Choose as many hairstyles as you’d like to try on virtually.",
          },
          {
            title: "Choose your hair color",
            description:
              "Go bold or stay natural, explore a variety of natural shades or select a single color that is close to your natural hair tone or the one you’d like to try.",
          },
          {
            title: "Get your AI hairstyle",
            description:
              "Sit back while AI Hairstyle works its magic. In seconds, see yourself in all the styles you selected—no scissors needed!",
          },
        ],
      },

      features: {
        title: "Why Choose Our AI Hairstyle Try-On Tool",
        subtitle:
          "Experience the easiest way to explore your next hairstyle. With advanced AI, instant access, and the largest style collection, finding your perfect look has never been simpler.",
        features: [
          {
            icon: <BookImage size={32} />,
            title: "Largest Hairstyle Collection",
            description:
              "We don’t just offer styles—we provide a vast gallery of trending cuts and classic looks. Explore hundreds of options across every length, texture, and trend.",
          },
          {
            icon: <Globe size={32} />,
            title: "Instant Access, Anywhere",
            description:
              "Use AI hairstyle tool right in your browser—no app required. It’s fully mobile-friendly, so you can try on hairstyles anytime, anywhere with just a photo.",
          },
          {
            icon: <GalleryHorizontalEnd size={32} />,
            title: "10,000+ Try-Ons Completed",
            description:
              "AI hairstyle tool has already powered over 10,000 virtual try-ons, helping thousands of people confidently achieve their dream look.",
          },
          {
            icon: <Bot size={32} />,
            title: "AI-Powered Technology",
            description:
              "Our cutting-edge AI ensures ultra-realistic and accurate hairstyle previews, so you can make confident decisions with ease.",
          },
          {
            icon: <ShieldUser size={32} />,
            title: "Privacy Protected",
            description:
              "Your photos are processed securely and never stored or shared. Your privacy is our top priority.",
          },
          {
            icon: <BadgeDollarSign size={32} />,
            title: "Money-Back Guarantee",
            description:
              "If you're not happy with your results, we offer a full refund—no questions asked.",
          },
        ],
      },

      pricing: {
        title: "How to Try On AI Hairstyle Online",
        subtitle:
          "Experience different hairstyles with AI using just a selfie. Start with a free trial credits or buy more, no subscription required",
        plans: [
          {
            title: "Try AI Hairstyle for Free",
            badge: "Free Trial",
            badgeColor: "primary",
            description:
              "Upload your photo and instantly see how an AI hairstyle looks on you. New users get 3 free credits, no credit card needed.",
            buttonText: "Upload Photo – Try It Free",
            footerText: "Includes 3 free credits for new users",
            onButtonClick: handleUpload,
          },
          {
            title: "Unlock More AI Hairstyle Try-Ons",
            badge: "Buy Credits",
            badgeColor: "secondary",
            description:
              "Want to explore more styles? Purchase credits to try unlimited AI-generated hairstyles on your own photo.",
            buttonText: `Buy Credits – $${product.price} for ${product.credits} Credits`,
            footerText: "More contact support@hairroom.app",
            loading: requestPayment,
            onButtonClick: handleBuyCredits,
          },
        ],
      },

      alternatingContent: {
        contentBlocks: [
          {
            title: "Find Your Perfect Style Instantly",
            description:
              "Choosing new hairstyle ideas can be overwhelming when browsing through countless similar examples on Pinterest and Instagram. Stop wasting time and use AI hairstyle technology to try various styles on your own photos. Explore dozens of AI hairstyle options and colors in just minutes to find the one that flatters you most.",
            cover: "https://cdn.hairroom.app/assets/images/content-1.webp",
          },
          {
            title: "Avoid Hair Disasters",
            description:
              "Still troubled by hairstyles that don't meet your expectations? AI hairstyle generator lets you preview any style in advance, giving you complete confidence before making major changes. Say goodbye to expensive mistakes with realistic AI hairstyle previews.",
            cover: "https://cdn.hairroom.app/assets/images/content-2.webp",
          },
          {
            title: "Test Bold Changes Risk-Free",
            description:
              'Curious about that dramatic chop or those face-framing bangs? Don\'t wonder "what if" anymore. AI hairstyle tool shows you realistic results instantly, so you can confidently book that appointment or decide to keep your current length with AI hairstyle simulations.',
            cover: "https://cdn.hairroom.app/assets/images/content-3.webp",
          },
          {
            title: "Shop Wigs with Confidence",
            description:
              "Online wig shopping doesn't have to be a gamble. Use AI hairstyle technology to try on different wig styles, colors, and lengths virtually before purchasing. Save time and money by knowing exactly how each wig will look with our AI hairstyle preview system.",
            cover: "https://cdn.hairroom.app/assets/images/content-4.webp",
          },
          {
            title: "Special Occasions Made Easy",
            description:
              "Wedding coming up? Job interview? Big date? Don't stress about your hair. Try different formal styles, updos, or glamorous looks using AI hairstyle previews to find the perfect match for your special occasion — all from the comfort of your home.",
            cover: "https://cdn.hairroom.app/assets/images/content-5.webp",
          },
          {
            title: "For Hair Stylists: Wow Your Clients",
            description:
              "Transform your consultation process with AI hairstyle technology by showing clients exactly how different styles will look on them. Reduce miscommunication, increase client confidence, and boost satisfaction with realistic AI hairstyle visualizations. Perfect for building trust and showcasing your expertise.",
            cover: "https://cdn.hairroom.app/assets/images/content-6.webp",
          },
        ],
      },
      cta: {
        title: "Find Your Dream Look",
        subtitle: "with the Largest AI Hairstyles Collection",
        userCount: "12,421+",
        buttonText: "Try It Now",
        testimonialAvatars: [
          "https://cdn.hairroom.app/assets/images/testimonial-1.webp",
          "https://cdn.hairroom.app/assets/images/testimonial-2.webp",
          "https://cdn.hairroom.app/assets/images/testimonial-3.webp",
          "https://cdn.hairroom.app/assets/images/testimonial-4.webp",
          "https://cdn.hairroom.app/assets/images/testimonial-5.webp",
        ],
      },
      testimonials: {
        title: "Testimonials",
        subtitle:
          "Here's what users are saying about AI hairstyle try-on and the new looks they've fallen in love with before stepping into the salon!",
        testimonials: [
          {
            name: "Darlene Yancey",
            content:
              "Love this website!!! The AI Hairstyle feature really helped me make a decision on my haircut! I actually had my hair cut earlier today exactly like the picture & I love it! I'm so glad I found your site & took the time to use it!!",
            avatar:
              "https://cdn.hairroom.app/assets/images/testimonial-woman-1.webp",
          },
          {
            name: "Marcus Johnson",
            content:
              "This AI Hairstyle tool saved me from making a huge mistake! I was thinking about getting a buzz cut, but after seeing it virtually, I realized it wasn't the right look for me. Found a much better style instead!",
            avatar:
              "https://cdn.hairroom.app/assets/images/testimonial-man-1.webp",
          },
          {
            name: "Jessica Chen",
            content:
              "Amazing accuracy! The AI Hairstyle generator perfectly showed how different colors and cuts would look on me. Now I get compliments on my hair everywhere I go!",
            avatar:
              "https://cdn.hairroom.app/assets/images/testimonial-woman-2.webp",
          },
          {
            name: "David Rodriguez",
            content:
              "As a guy who's always just asked for 'the usual' at the barbershop, this AI Hairstyle app gave me the confidence to try something completely different. My friends can't believe how good I look!",
            avatar:
              "https://cdn.hairroom.app/assets/images/testimonial-man-2.webp",
          },
        ],
      },

      faqs: {
        title: "Frequently Asked Questions",
        subtitle:
          "Get answers to common questions about AI hairstyle try-on service and discover how to make the most of your virtual makeover experience",
        faqs: [
          {
            question: "How does the AI hairstyle try-on work?",
            answer:
              "Simply upload a clear selfie, and our advanced AI hairstyle technology analyzes your facial features to realistically apply different hairstyles with accurate lighting, shadows, and proportions.",
          },
          {
            question: "How accurate are the AI hairstyle previews?",
            answer:
              "AI hairstyle generator provides highly realistic previews by considering your face shape, skin tone, and hair texture to show you exactly how each style would look on you.",
          },
          {
            question: "Can I try multiple hairstyles on the same photo?",
            answer:
              "Yes! You can apply unlimited AI hairstyle variations to the same photo and compare them side by side to find your perfect look before visiting the salon.",
          },
          {
            question: "What photo quality works best for AI hairstyle try-on?",
            answer:
              "For optimal AI hairstyle results, use a clear, well-lit front-facing photo with your current hair pulled back to clearly show your face shape and features.",
          },
          {
            question: "Are my photos stored or shared?",
            answer:
              "No, we prioritize your privacy. Photos uploaded for AI hairstyle try-on are processed securely and are not stored on our servers or shared with third parties.",
          },
          {
            question: "Can I download my AI hairstyle results?",
            answer:
              "Absolutely! You can download all your AI hairstyle previews to save them, share with friends, or show your stylist for reference.",
          },
          {
            question: "How many credits does each AI hairstyle try-on cost?",
            answer:
              "Each AI hairstyle transformation uses 1 credit. New users get 3 free credits, and you can purchase additional credits starting at $9 for 100 credits.",
          },
          {
            question: "What types of hairstyles can I try with AI?",
            answer:
              "AI hairstyle library includes hundreds of options: short cuts, long styles, curly, straight, bangs, layers, trendy colors, and classic looks updated regularly.",
          },
          {
            question: "Does the AI hairstyle tool work on mobile devices?",
            answer:
              "Yes! AI hairstyle platform is fully mobile-optimized and works perfectly on smartphones and tablets for trying on styles anywhere.",
          },
          {
            question: "Can I get a refund if I'm not satisfied?",
            answer:
              "We stand behind AI hairstyle service with a satisfaction guarantee. If you're not happy with your results, contact support within 30 days for assistance.",
          },
        ],
      },
    };
  }, [product, requestPayment, handleUpload, handleBuyCredits]);

  const headings = useMemo(() => {
    return [
      {
        title: "AI Hairstyle Changer",
        subtitle: "Choose your desired new hairstyle",
      },
      {
        title: "Style Settings",
        subtitle: "Hair color and additional detail",
      },
      {
        title: "Generation Preview",
        subtitle: "Review your request and starting",
      },
    ];
  }, []);

  return (
    <Fragment>
      <Landing
        {...pageData}
        openRef={openRef}
        onCTAClick={handleUpload}
        onFileUpload={(photo) => changerRef.current?.open(photo)}
      />
      <HairstyleChanger
        ref={changerRef}
        headings={headings}
        types={hairtypes}
        hairstyles={hairstyles}
        colors={colors}
      />
    </Fragment>
  );
}
