import { UploadCloud } from "lucide-react";
import clsx from "clsx";

import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
} from "react-compare-slider";
import { Dropzone, type DropzoneProps } from "~/components/ui";
import { Image } from "~/components/common";

import { useState, useEffect } from "react";

export interface HeroSectionProps {
  title: string;
  description: string;
  buttonText: string;
  dropHintText: string;
  exampleHintText: string;
  secondaryDescription: string;
  testimonialText: string;
  diffImages: [string, string];
  exampleImages: string[];
  testimonialAvatars: string[];

  onUpload?: (file: File) => void;
  openRef?: DropzoneProps["openRef"];
}

export default function HeroSection({
  title,
  description,
  buttonText,
  testimonialText,
  dropHintText,
  exampleHintText,
  secondaryDescription,
  openRef,
  onUpload,
  diffImages,
  exampleImages,
  testimonialAvatars,
}: HeroSectionProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  const [downloading, setDownloading] = useState(false);
  const handleExampleClick = async (url: string) => {
    if (downloading) return;
    setDownloading(true);
    const res = await fetch(url).finally(() => setDownloading(false));
    const blob = await res.blob();
    const fileName = url.split("/").pop() ?? "";
    const file = new File([blob], fileName, { type: res.type });

    onUpload?.(file);
  };

  return (
    <div id="hero" className="bg-base-200 pt-16 md:pt-24">
      <div className="container mb-4 md:my-8 lg:my-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
          <div className="max-lg:order-2">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4">
              {title}
            </h1>
            <p className="text-base sm:text-lg whitespace-pre-line">
              {description}
            </p>

            <div className="my-4 lg:mt-12 lg:mb-8">
              <Dropzone
                multiple={false}
                openRef={openRef}
                onFilesAccepted={([file]) => {
                  if (file.validSize && file.validType) onUpload?.(file.file);
                }}
              >
                <button type="button" className="btn btn-wide btn-primary">
                  <UploadCloud size={20} />
                  {buttonText}
                </button>
                <p className="text-base max-md:hidden">{dropHintText}</p>
              </Dropzone>

              <div className="flex gap-3 flex-col lg:flex-row my-3">
                <div className="flex items-center max-lg:justify-center lg:text-sm lg:opacity-70">
                  {exampleHintText}
                </div>
                <div
                  className={clsx(
                    "flex-1 min-w-0 w-full sm:max-w-60 lg:max-w-none",
                    "max-lg:grid max-lg:grid-cols-4 max-lg:gap-4 max-lg:mx-auto",
                    "lg:flex lg:gap-2 lg:justify-end"
                  )}
                >
                  {exampleImages.map((src, i) => (
                    <Image
                      key={i}
                      loading="lazy"
                      className="w-full lg:w-10 aspect-square bg-base-300 rounded-box object-cover cursor-pointer"
                      src={src}
                      alt="ai hairstyle example photo"
                      onClick={(e) => handleExampleClick(e.currentTarget.src)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-sm">{secondaryDescription}</p>

            <div className="flex items-center max-lg:justify-center gap-2 my-3">
              <div className="avatar-group -space-x-4">
                {testimonialAvatars.slice(0, 5).map((img, i) => (
                  <div className="avatar" key={i}>
                    <div className="w-8">
                      <Image
                        src={img}
                        wsrv={{ w: 64 }}
                        loading="lazy"
                        alt="testimonial avtars"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    className="mask mask-star-2 bg-orange-400 w-4 h-4"
                    key={i}
                  />
                ))}
              </div>
            </div>

            {testimonialText && (
              <p className="text-sm opacity-70 max-lg:text-center">
                {testimonialText}
              </p>
            )}
          </div>

          <div className="max-lg:order-1">
            <ReactCompareSlider
              className="aspect-video rounded-box overflow-hidden"
              keyboardIncrement="10%"
              boundsPadding={36}
              handle={
                <ReactCompareSliderHandle
                  buttonStyle={{ width: 40, height: 40 }}
                />
              }
              itemOne={
                <div className="w-full h-full relative">
                  <div
                    className="absolute top-3 left-3 bg-white/40 text-white text-sm py-0.5 px-2.5 rounded-sm before:content-[attr(data-label)]"
                    data-label="Before"
                  />
                  <Image
                    alt="ai hairstyle before"
                    src={diffImages[0]}
                    wsrv={{ w: 736 }}
                  />
                </div>
              }
              itemTwo={
                <div className="w-full h-full relative">
                  <div
                    className="absolute top-3 right-3 bg-white/40 text-white text-sm py-0.5 px-2.5 rounded-sm before:content-[attr(data-label)]"
                    data-label="After"
                  />
                  <Image
                    alt="ai hairstyle after"
                    src={diffImages[1]}
                    wsrv={{ w: 736 }}
                  />
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
