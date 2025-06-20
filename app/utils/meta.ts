import type { MetaDescriptor } from "react-router";

export const createCanonical = (
  pathname: string,
  domain: string
): MetaDescriptor => {
  return {
    tagName: "link",
    rel: "canonical",
    href: new URL(pathname, domain).toString(),
  };
};
