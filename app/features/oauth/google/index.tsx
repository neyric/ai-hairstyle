import { useState, forwardRef } from "react";
import { useMatches } from "react-router";
import { useUser } from "~/store";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleOAuthBtn, type GoogleOAuthBtnRef } from "./btn";

export { type GoogleOAuthBtnRef };

interface GoogleOAuthProps {
  useOneTap?: boolean;
  onSuccess?: () => void;
}
export const GoogleOAuth = forwardRef<GoogleOAuthBtnRef, GoogleOAuthProps>(
  ({ useOneTap, onSuccess }, ref) => {
    const matches = useMatches();
    const rootMatch = matches[0].data as { GOOGLE_CLIENT_ID: string };
    const clientId = rootMatch.GOOGLE_CLIENT_ID;

    const setUser = useUser((state) => state.setUser);
    const setCredits = useUser((state) => state.setCredits);
    const [signing, setSigning] = useState(false);

    const handleSuccess = async (value: {
      access_token?: string;
      credential?: string;
    }) => {
      const values = {
        type: "google",
        data: value,
      };

      setSigning(true);
      const res = await fetch("/api/auth", {
        method: "post",
        body: JSON.stringify(values),
      }).finally(() => setSigning(false));

      if (res.ok) {
        const { profile, credits } = await res.json<{
          profile: UserInfo;
          credits: number;
        }>();

        setUser(profile);
        setCredits(credits);

        setTimeout(() => {
          onSuccess?.();
        }, 16);
      }
    };
    return (
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleOAuthBtn
          ref={ref}
          loading={signing}
          onSuccess={handleSuccess}
          useOneTap={useOneTap}
        />
      </GoogleOAuthProvider>
    );
  }
);
