import clsx from "clsx";
import { Link } from "react-router";

import {
  UserDetail,
  GoogleSolid,
  LinktreeLogoFill,
  Pinterest,
  TwitterSolid,
} from "~/components/icons";

interface SocialsProps extends React.ComponentProps<"div"> {
  iconSize?: number;
  strokeWidth?: number;
}
export const Socials = ({
  iconSize,
  strokeWidth = 1,
  className,
  ...props
}: SocialsProps) => {
  return (
    <div
      className={clsx("flex items-center justify-center gap-3 mb-4", className)}
      {...props}
    >
      <Link to="https://about.me/" target="_blank" title="Aboue Me">
        <UserDetail
          strokeWidth={strokeWidth}
          width={iconSize}
          height={iconSize}
          className="w-6 h-6"
        />
      </Link>
      <Link to="https://x.com/" target="_blank" title="Twitter">
        <TwitterSolid
          strokeWidth={strokeWidth}
          width={iconSize}
          height={iconSize}
          className="w-6 h-6"
        />
      </Link>
      <Link
        to="https://www.pinterest.com/"
        target="_blank"
        title="Hairroom Pinterest"
      >
        <Pinterest
          strokeWidth={strokeWidth}
          width={iconSize}
          height={iconSize}
          className="w-6 h-6"
        />
      </Link>
    </div>
  );
};
