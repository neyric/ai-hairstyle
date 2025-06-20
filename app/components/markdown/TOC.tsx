import clsx from "clsx";
import { useState, useEffect, useMemo, useRef } from "react";
import { type RenderableTreeNodes, type Tag } from "@markdoc/markdoc";

interface TableOfContentsProps extends React.ComponentProps<"div"> {
  node: RenderableTreeNodes;
  offset?: number;
}
export const TableOfContents = ({
  node,
  className,
  offset = 0,
  ...props
}: TableOfContentsProps) => {
  const [activeHeading, setActiveHeading] = useState(0);
  const lastScrollY = useRef(0);

  const sections = useMemo(() => collectHeadings(node), [node]);

  useEffect(() => {
    const headingList = getProseHeadingList();
    const observeHeight = window ? window.innerHeight / 2 : 200;

    const observer = new IntersectionObserver(
      (entries) => {
        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > lastScrollY.current;
        lastScrollY.current = currentScrollY;

        const candidates = entries.filter((entry) => {
          const rect = entry.boundingClientRect;
          return (
            rect.bottom <= window.innerHeight + observeHeight &&
            rect.bottom >= window.innerHeight - observeHeight
          );
        });

        // 处理进入/离开事件
        candidates.forEach((entry) => {
          const index = headingList.indexOf(entry.target);

          if (entry.isIntersecting) {
            // 元素进入底部区域时设置当前索引
            setActiveHeading(index);
          } else {
            // 元素离开底部区域时处理逻辑
            if (isScrollingDown) {
              // 向下滚动时保持当前索引
              return;
            }
            // 向上滚动时切换到前一个索引
            setActiveHeading((prev) => {
              const index = Math.max(prev - 1, 0);
              return index <= 0 ? 0 : index;
            });
          }
        });
      },
      {
        root: null,
        rootMargin: `0px 0px -${observeHeight}px 0px`,
        threshold: 0.1,
      }
    );

    headingList.forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  const handleToHeading = (index: number) => {
    const headingList = getProseHeadingList() as HTMLHeadingElement[];
    const heading = headingList[index];

    if (!heading || !window) return;
    const rectTop = heading.getBoundingClientRect().top;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const elementTop = rectTop + scrollTop;

    window.scrollTo({
      top: Math.floor(elementTop) + offset,
      behavior: "smooth",
    });
  };

  return (
    <div className={clsx("my-2", className)} {...props}>
      <h2 className="text-lg font-bold text-neutral-800 mb-2">
        Table of Contents
      </h2>
      <ul className="space-y-1 text-sm text-neutral-600">
        {sections.map((section, i) => (
          <li
            key={i}
            className={clsx(
              "cursor-pointer data-[active=true]:!font-bold hover:font-medium",
              "hover:text-neutral-900 data-[active=true]:text-neutral-900",
              "data-[name=h3]:pl-3"
            )}
            data-name={section.name}
            data-active={i === activeHeading}
            onClick={() => handleToHeading(i)}
          >
            {section.id ? (
              <a onClick={(e) => e.preventDefault()} href={`#${section.id}`}>
                {section.title}
              </a>
            ) : (
              <span>{section.title}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const getProseHeadingList = () => {
  if (!document) return [];
  return Array.from(document.querySelectorAll(".prose h1, .prose h2, .prose h3"));
};

type Section = { title: string; name: string } & Record<string, string>;
function collectHeadings(node: RenderableTreeNodes, sections: Section[] = []) {
  if (typeof node !== "object") return sections;
  if (Array.isArray(node)) return sections;

  if (node) {
    // Match all h1, h2, h3… tags
    if (
      typeof node.name === "string" &&
      !!node.children &&
      node.name.match(/h\d/)
    ) {
      const title = (node.children as Tag<string, Record<string, any>>[])[0];

      if (typeof title === "string") {
        sections.push({
          ...(node.attributes as Record<string, any>),
          name: node.name,
          title,
        });
      }
    }

    if (node.children) {
      for (const child of node.children as Tag<string, Record<string, any>>[]) {
        collectHeadings(child, sections);
      }
    }
  }

  return sections;
}
