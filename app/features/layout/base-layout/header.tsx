import clsx from "clsx";
import { Fragment, useState } from "react";

import { useUser } from "~/store";
import { useWindowScroll } from "~/hooks/dom";
import { GoogleOAuth } from "~/features/oauth";

import { Menu, X } from "lucide-react";
import { Logo, Link } from "~/components/common";
import { Image } from "~/components/common";

export interface HeaderProps {
  navLinks: Array<{
    to: string;
    label: string;
    target?: React.HTMLAttributeAnchorTarget;
  }>;
}
export const Header = ({ navLinks }: HeaderProps) => {
  const user = useUser((state) => state.user);
  const credits = useUser((state) => state.credits);

  const [openDrawer, setOpenDrawer] = useState(false);

  const { y } = useWindowScroll();
  const isScroll = y >= 30;

  return (
    <Fragment>
      <header
        data-scroll={isScroll}
        className={clsx(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300",
          "bg-transparent h-24 data-[scroll=true]:h-16 max-md:h-16",
          "data-[scroll=true]:bg-white/90 data-[scroll=true]:shadow data-[scroll=true]:backdrop-blur"
        )}
      >
        <div className="container flex h-full items-center">
          <Link to="/">
            <Logo />
          </Link>
          <nav className="mx-8 [&>a]:hover:underline flex items-center gap-6 whitespace-nowrap max-md:hidden">
            {navLinks.map((link, i) => (
              <Link key={i} to={link.to} target={link.target}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="grow" />
          <div className="flex items-center justify-center gap-4">
            {user !== void 0 && (
              <>
                {user ? (
                  <div className="flex items-center gap-2 max-w-32">
                    <div className="avatar">
                      <div className="w-8 rounded-full bg-base-300">
                        {user.avatar && (
                          <Image loading="eager" src={user.avatar} />
                        )}
                      </div>
                    </div>
                    <div className="text-xs leading-none flex-1 min-w-0 whitespace-nowrap">
                      <div className="font-bold mb-0.5 overflow-hidden overflow-ellipsis">
                        {user.name}
                      </div>
                      <div className="opacity-70 overflow-hidden overflow-ellipsis">
                        Credits: {credits}
                      </div>
                    </div>
                  </div>
                ) : (
                  <GoogleOAuth useOneTap />
                )}
              </>
            )}

            <div className="drawer">
              <input
                id="header-drawer"
                type="checkbox"
                checked={openDrawer}
                onChange={() => setOpenDrawer(!openDrawer)}
                className="drawer-toggle"
                aria-label="Drawer Toggle"
              />
              <div className="drawer-content">
                <label
                  htmlFor="header-drawer"
                  className="swap swap-rotate md:hidden"
                >
                  <input
                    type="checkbox"
                    checked={openDrawer}
                    onChange={() => {}}
                    aria-label="Drawer Menu Button"
                  />
                  <Menu className="swap-off" size={32} />
                  <X className="swap-on" size={32} />
                </label>
              </div>
              <div className="drawer-side">
                <label
                  htmlFor="header-drawer"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                />
                <div className="bg-base-200 text-base-content min-h-full w-4/5 max-w-xs relative">
                  <div className="p-4 sticky top-0 w-full bg-base-200 border-b border-base-300">
                    <Link to="/" onClick={() => setOpenDrawer(false)}>
                      <Logo />
                    </Link>
                  </div>
                  <ul className="menu menu-lg w-full">
                    {navLinks.map((link, i) => (
                      <li key={i} onClick={() => setOpenDrawer(false)}>
                        <Link
                          className="rounded-box"
                          to={link.to}
                          target={link.target}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </Fragment>
  );
};
