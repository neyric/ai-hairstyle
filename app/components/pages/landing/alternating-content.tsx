import { Image } from "~/components/common";

interface ContentBlock {
  title: string;
  description: string;
  cover?: string;
}

export interface AlternatingContentSectionProps {
  contentBlocks: ContentBlock[];
}

export default function AlternatingContentSection({
  contentBlocks,
}: AlternatingContentSectionProps) {
  return (
    <div className="container my-6 md:my-12 lg:my-18 relative">
      <div id="alternating" className="absolute -top-20" />
      <div className={`card bg-primary/15`}>
        <div className="card-body gap-y-8">
          {contentBlocks.map((block, i) => (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 items-center"
              key={i}
            >
              <div
                className="aspect-video md:aspect-[4/3] lg:aspect-video bg-white rounded-box md:data-[reverse=true]:order-2 flex items-center justify-center"
                data-reverse={!!(i % 2)}
              >
                {block.cover ? (
                  <Image
                    src={block.cover}
                    alt={block.title}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-box"
                    wsrv={{ w: 560 }}
                  />
                ) : (
                  <div className="text-gray-400 font-semibold">
                    Image Placeholder
                  </div>
                )}
              </div>

              <div className="order-1">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">
                  {block.title}
                </h3>
                <p className="text-base">{block.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
