import { Outlet } from "react-router";
import type { Route } from "./+types/index";

import { BaseLayout, type BaseLayoutProps } from "~/features/layout";

export const loader = ({}: Route.LoaderArgs) => {
  const header: BaseLayoutProps["header"] = {
    navLinks: [
      { label: "AI Hairstyle", to: "/" },
      { label: "How it Works", to: "/#how-it-works" },
      { label: "Pricing", to: "/#pricing" },
      { label: "FAQs", to: "/#faqs" },
    ],
  };

  const footer: BaseLayoutProps["footer"] = {
    navLinks: [
      {
        label: "Tools",
        list: [{ to: "/", label: "AI Hairstyle" }],
      },
      {
        label: "Support",
        list: [
          {
            to: "mailto:support@example.com",
            label: "support@example.com",
            target: "_blank",
          },
        ],
      },
      {
        label: "Legal",
        list: [
          { to: "/legal/terms", label: "Terms of Use", target: "_blank" },
          { to: "/legal/privacy", label: "Privacy Policy", target: "_blank" },
          { to: "/legal/cookie", label: "Cookie Policy", target: "_blank" },
        ],
      },
    ],
  };

  return { header, footer };
};

export default function Layout({
  loaderData: { header, footer },
}: Route.ComponentProps) {
  return (
    <BaseLayout header={header} footer={footer}>
      <Outlet />
    </BaseLayout>
  );
}
