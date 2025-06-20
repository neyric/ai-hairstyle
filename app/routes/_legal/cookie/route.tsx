import type { Route } from "./+types/route";

import { Legal } from "~/components/pages/legal";
import { parseMarkdown } from "~/.server/libs/markdown";
import content from "./content.md?raw";

import { createCanonical } from "~/utils/meta";

export const meta: Route.MetaFunction = ({ matches }) => {
  return [
    { title: "Cookie Policy - HairRoom" },
    {
      name: "description",
      content:
        "Find out how HairRoom use cookies and similar technologies to enhance your experience. Learn about your choices regarding cookie settings and consent.",
    },
    createCanonical("/legal/cookie", matches[0].data.DOMAIN),
  ];
};

export const loader = ({}: Route.LoaderArgs) => {
  const { node } = parseMarkdown(content);
  return { node };
};

export default function Page({ loaderData: { node } }: Route.ComponentProps) {
  return <Legal node={node} />;
}
