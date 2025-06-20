import markdoc from "@markdoc/markdoc";
import * as tags from "./tags";

export function parseMarkdown(markdown: string) {
  const ast = markdoc.parse(markdown);

  const node = markdoc.transform(ast, {
    tags,
  });

  return { ast, node };
}
