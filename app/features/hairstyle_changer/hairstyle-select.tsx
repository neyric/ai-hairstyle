import { useMemo } from "react";
import { Image } from "~/components/common";

export interface Hairstyle {
  cover: string;
  name: string;
  value: string;
  type: string;
}
interface HairstyleSelectProps
  extends Omit<React.ComponentProps<"div">, "onChange"> {
  types: Array<{ label: string; value: string }>;
  activeType: string;
  onChangeType: (type: string) => void;
  hairstyles: Array<Hairstyle>;
  value: string[];
  onChange: (value: string[]) => void;
}

export const HairstyleSelect = ({
  types,
  activeType,
  onChangeType,
  hairstyles,
  value,
  onChange,
  ...props
}: HairstyleSelectProps) => {
  const renderHairstyles = useMemo(() => {
    if (!activeType) return hairstyles;
    return hairstyles.filter((hairstyle) => hairstyle.type === activeType);
  }, [hairstyles, activeType]);

  const checkedSet = useMemo(() => {
    return new Set(value);
  }, [value]);

  const handleToggle = (hairstyle: Hairstyle) => {
    if (checkedSet.has(hairstyle.value)) onChange([]);
    else onChange([hairstyle.value]);
    // let newValue = Array.from(value);
    // if (checkedSet.has(hairstyle.value)) {
    //   newValue = newValue.filter((value) => value !== hairstyle.value);
    // } else {
    //   newValue = newValue.concat(hairstyle.value);
    // }
    // onChange(newValue);
  };

  return (
    <div {...props}>
      <div className="tabs tabs-sm sm:tabs-md tabs-border mb-3 sm:mb-4">
        {types.map((tab, i) => (
          <input
            key={`type_${i}`}
            type="radio"
            name="active_hairtype_tab"
            className="tab"
            aria-label={tab.label}
            checked={tab.value === activeType}
            onChange={() => onChangeType(tab.value)}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {renderHairstyles.map((hairstyle, i) => (
          <div
            className="cursor-pointer"
            key={`${hairstyle.type}_${hairstyle.value}`}
          >
            <div
              className="w-full aspect-[3/4] bg-base-300 rounded-box overflow-hidden relative"
              onClick={() => handleToggle(hairstyle)}
            >
              <div className="absolute top-2 right-2 z-[1]">
                <input
                  type="checkbox"
                  name="hairstyles"
                  className="checkbox checkbox-xs block checked:checkbox-primary"
                  checked={checkedSet.has(hairstyle.value)}
                  onChange={() => handleToggle(hairstyle)}
                />
              </div>
              <Image
                className="w-full h-full object-cover"
                loading="lazy"
                src={hairstyle.cover}
              />
            </div>
            <div
              className="text-center text-xs whitespace-nowrap overflow-hidden overflow-ellipsis mt-0.5 before:content-[attr(aria-label)]"
              aria-label={hairstyle.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
