import { clsx } from "clsx";
import { Image } from "~/components/common";

type LogoSize = "sm" | "base" | "lg";

interface LogoProps extends React.ComponentProps<"div"> {
  size?: LogoSize;
  iconSize?: LogoSize;
}

export const Logo = ({
  size = "base",
  iconSize,
  className,
  ...rest
}: LogoProps) => {
  const sizeStyles = {
    sm: {
      box: "w-6 h-6",
      text: "text-sm",
    },
    base: {
      box: "w-9 h-9",
      text: "text-lg",
    },
    lg: {
      box: "w-12 h-12",
      text: "text-2xl",
    },
  };

  return (
    <div className={clsx("flex items-center gap-2", className)} {...rest}>
      <div className={clsx("rounded-box", sizeStyles[iconSize ?? size].box)}>
        <Image
          className="w-full h-full object-cover"
          src="/assets/logo.webp"
          alt="HairRoom, Try-on AI Hairstyle"
        />
      </div>
      <div className={clsx("font-title", sizeStyles[size].text)}>HairRoom</div>
    </div>
  );
};
