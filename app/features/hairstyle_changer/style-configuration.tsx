import clsx from "clsx";

import { Ban } from "lucide-react";
import { Image } from "~/components/common";

export interface HairColor {
  name: string;
  value: string;
  type?: string;
  color?: string;
  cover?: string;
}

interface StyleConfigurationProps extends React.ComponentProps<"div"> {
  colors: Array<HairColor>;
  color: string;
  onColorChange: (value: string) => void;
  detail: string;
  onDetailChange: (value: string) => void;
}
export const StyleConfiguration = ({
  colors,
  color: colorValue,
  onColorChange,
  detail,
  onDetailChange,
  ...props
}: StyleConfigurationProps) => {
  function adjustBrightness(hex: string, factor: number) {
    // 去掉 "#" 符号
    const cleanHex = hex.replace(/^#/, "");

    // 将 hex 转为 RGB
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    // 根据 factor 增亮或变暗，限制在 [0, 255] 范围
    const adjust = (c: number) => {
      return Math.min(255, Math.max(0, Math.round(c * factor)));
    };

    const newR = adjust(r);
    const newG = adjust(g);
    const newB = adjust(b);

    // 转回 hex 格式
    const toHex = (c: number) => c.toString(16).padStart(2, "0");

    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
  }

  const handleChangeColor = (color: HairColor) => {
    onColorChange(color.value);
  };
  return (
    <div {...props}>
      <div>
        <div className="text-sm font-bold opacity-70">Hair Color</div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4 my-2">
          {colors.map((color) => {
            return (
              <div
                className="cursor-pointer bg-base-300/40 p-1.5 sm:p-2 rounded-box aria-checked:bg-primary/15"
                key={color.value}
                aria-checked={color.value === colorValue}
                onClick={() => handleChangeColor(color)}
              >
                <div
                  className={clsx(
                    "w-full flex flex-col items-center justify-center",
                    "aspect-square rounded-box overflow-hidden relative"
                  )}
                >
                  {color.cover ? (
                    <>
                      <Image
                        loading="lazy"
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
                    <>
                      {color.color ? (
                        <div
                          className={clsx(
                            "w-full h-full relative",
                            "bg-gradient-to-bl from-white to-white"
                          )}
                          style={
                            color.color
                              ? ({
                                  "--tw-gradient-from": adjustBrightness(
                                    color.color,
                                    0.8
                                  ),
                                  "--tw-gradient-to": adjustBrightness(
                                    color.color,
                                    1.2
                                  ),
                                } as React.CSSProperties)
                              : {}
                          }
                        />
                      ) : (
                        <Ban size={36} className="opacity-50" />
                      )}
                    </>
                  )}
                </div>

                <div
                  className="text-center text-xs leading-none whitespace-nowrap overflow-hidden overflow-ellipsis mt-1 before:content-[attr(aria-label)]"
                  aria-label={color.name}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4">
        <label
          htmlFor="detail_notes"
          className="text-sm font-bold block opacity-70"
        >
          Special Requests (Optional)
        </label>
        <textarea
          id="detail_notes"
          name="detail_notes"
          className="textarea w-full rounded-box my-2 focus:outline-0 min-h-28"
          value={detail}
          onChange={(e) => onDetailChange(e.currentTarget.value)}
          placeholder="Tell us more about the style you're envisioning (optional)"
        />
      </div>
    </div>
  );
};
