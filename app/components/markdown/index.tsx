import * as React from "react";
import clsx from "clsx";
import markdoc, { type RenderableTreeNodes } from "@markdoc/markdoc";

export * from "./TOC";

interface MarkdownArticleProps extends React.ComponentProps<"div"> {
  node: RenderableTreeNodes;
}
export function MarkdownArticle({
  node,
  className,
  ...props
}: Omit<MarkdownArticleProps, "children">) {
  return (
    <div
      className={clsx(
        "prose prose-invert prose-sm md:prose-base max-w-full",
        "prose-headings:mt-4 prose-headings:mb-2 prose-h1:mb-4 prose-h1:mt-6 prose-h2:mb-4 prose-h2:mt-6",
        "prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-img:my-4",
        "prose-img:rounded-sm prose-img:w-full prose-ul:pl-4",
        "prose-a:text-primary-500",
        className
      )}
      {...props}
    >
      {markdoc.renderers.react(node, React)}
    </div>
  );
}
