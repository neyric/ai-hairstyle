import { Image } from "~/components/common";

import { useMemo } from "react";
import { useUser } from "~/store";

import { Ban } from "lucide-react";

import { type Hairstyle } from "./hairstyle-select";
import { type HairColor } from "./style-configuration";

interface ConfirmPreviewProps
  extends Omit<React.ComponentProps<"div">, "color"> {
  original: File;
  hairstyles: Hairstyle[];
  color: HairColor;
  detail: string;
}
export const ConfirmPreview = ({
  original,
  hairstyles,
  color,
  detail,
  ...props
}: ConfirmPreviewProps) => {
  const user = useUser((state) => state.user);
  const credits = useUser((state) => state.credits);

  const originalUrl = useMemo(() => {
    return URL.createObjectURL(original);
  }, [original]);

  return (
    <div {...props}>
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        <div className="w-full max-sm:w-1/2 sm:max-w-60 md:max-w-80">
          <div className="w-full aspect-[3/4] rounded-box overflow-hidden bg-base-300">
            <Image
              src={originalUrl}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0 w-full space-y-4">
          <div>
            <div className="font-bold opacity-70 mb-1">Transform Cost</div>
            <div className="flex items-center gap-2">
              <div className="badge badge-primary badge-sm badge-soft">
                {hairstyles.length} Credits
              </div>
              {!user && (
                <p className="text-sm opacity-70">
                  🎁 3 free credits for new users
                </p>
              )}
            </div>
          </div>
          <div>
            <div className="mb-2 font-bold opacity-70">Selected Hairstyles</div>
            <div className="grid grid-cols-3 md:grid-cols-3 xl:grid-cols-5 gap-3">
              {hairstyles.map((hairstyle) => (
                <div key={hairstyle.value}>
                  <div className="w-full aspect-[3/4] bg-base-300 rounded-box overflow-hidden">
                    <Image
                      src={hairstyle.cover}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="text-center text-sm leading-none whitespace-nowrap overflow-hidden overflow-ellipsis mt-1 before:content-[attr(aria-label)]"
                    aria-label={hairstyle.name}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="font-bold opacity-70">Hair Color</div>
            <div className="grid grid-cols-3 md:grid-cols-3 xl:grid-cols-5 gap-3">
              <div>
                <div className="w-full flex items-center justify-center aspect-square bg-base-300 rounded-box overflow-hidden relative">
                  {color.cover ? (
                    <>
                      <Image
                        className="w-full h-full object-cover"
                        src={color.cover}
                      />
                      {!!color.type && (
                        <div className="bg-base-100/80 text-base-content absolute top-1.5 right-1.5 text-xs rounded-sm px-1">
                          {color.type}
                        </div>
                      )}
                    </>
                  ) : (
                    <Ban size={36} className="opacity-50" />
                  )}
                </div>
                <div
                  className="text-center text-sm leading-none whitespace-nowrap overflow-hidden overflow-ellipsis mt-1 before:content-[attr(aria-label)]"
                  aria-label={color.name}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="font-bold opacity-70">Special Requests</div>
            {detail ? (
              <p className="text-sm">{detail}</p>
            ) : (
              <p className="text-sm opacity-50">
                No special requests for this hairstyle transformation.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
