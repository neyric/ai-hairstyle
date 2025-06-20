import { Fragment } from "react";
import { Header, type HeaderProps } from "./header";
import { Footer, type FooterProps } from "./footer";

export interface BaseLayoutProps {
  header: HeaderProps;
  footer: FooterProps;
}

export const BaseLayout = ({
  header,
  footer,
  children,
}: React.PropsWithChildren<BaseLayoutProps>) => {
  return (
    <Fragment>
      <Header {...header} />
      {children}
      <Footer {...footer} />
    </Fragment>
  );
};
