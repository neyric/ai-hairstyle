import { forwardRef, useImperativeHandle } from "react";
import { useGoogleOneTapLogin, useGoogleLogin } from "@react-oauth/google";

export interface GoogleOAuthBtnRef {
  login: () => void;
}

interface GoogleOAuthBtnProps {
  loading?: boolean;
  useOneTap?: boolean;
  onSuccess: (value: { access_token?: string; credential?: string }) => void;
}
export const GoogleOAuthBtn = forwardRef<
  GoogleOAuthBtnRef,
  GoogleOAuthBtnProps
>(({ loading, onSuccess, useOneTap }, ref) => {
  useGoogleOneTapLogin({
    onSuccess: ({ credential }) => onSuccess({ credential }),
    cancel_on_tap_outside: false,
    disabled: !useOneTap,
  });
  const login = useGoogleLogin({
    onSuccess: ({ access_token }) => onSuccess({ access_token }),
  });

  useImperativeHandle(ref, () => ({
    login: () => login(),
  }));

  return (
    <button
      id="google-oauth-btn"
      className="btn btn-primary max-md:btn-sm data-[loading=true]:cursor-not-allowed"
      onClick={() => {
        if (loading) return;
        login();
      }}
      data-loading={loading}
    >
      <span
        className="loading loading-spinner hidden data-[loading=true]:block"
        data-loading={loading}
      />
      Sign In
    </button>
  );
});
