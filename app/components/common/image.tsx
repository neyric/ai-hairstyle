import React from "react";

interface WsrvParams {
  [key: string]: string | number | boolean | undefined;
}

interface ImageProps extends React.ComponentProps<"img"> {
  proxy?: boolean; // 是否使用 wsrv.nl 代理
  wsrv?: WsrvParams; // 传入 wsrv.nl 的参数
}

export const Image = ({ src, proxy = true, wsrv, ...props }: ImageProps) => {
  let finalSrc = src;

  // 如果传入了 src 这个字段，就进入这个判断流程
  if (finalSrc) {
    const isRemote = typeof src === "string" && /^https:\/\//.test(src);

    if (proxy && isRemote) {
      const url = new URL("https://wsrv.nl/");
      url.searchParams.set("url", src!);

      if (wsrv) {
        for (const [key, value] of Object.entries(wsrv)) {
          if (value !== undefined) {
            url.searchParams.set(key, String(value));
          }
        }
      }

      finalSrc = url.toString();
    }
  }

  return <img src={finalSrc} {...props} />;
};
