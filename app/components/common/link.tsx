import { useState, useEffect, forwardRef } from "react";
import { Link as LinkComp, NavLink as NavLinkComp } from "react-router";
import type { LinkProps, NavLinkProps } from "react-router";

interface UseBaseLinkOptions {
  reloadDocument: LinkProps["reloadDocument"];
  target: LinkProps["target"];
}
const useBaseLink = ({ reloadDocument, target }: UseBaseLinkOptions) => {
  const [baseTarget, setBaseTarget] = useState(target);
  const [reload] = useState(reloadDocument ?? import.meta.env.PROD);

  useEffect(() => {
    if (baseTarget) return;
    if (window.self !== window.top) setBaseTarget("_blank");
  }, [baseTarget]);

  return { target: baseTarget, reloadDocument: reload };
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ reloadDocument, target, ...rest }, ref) => {
    const base = useBaseLink({ reloadDocument, target });
    return <LinkComp ref={ref} {...base} {...rest} />;
  }
);

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ reloadDocument, target, ...rest }, ref) => {
    const base = useBaseLink({ reloadDocument, target });

    return <NavLinkComp ref={ref} {...base} {...rest} />;
  }
);
