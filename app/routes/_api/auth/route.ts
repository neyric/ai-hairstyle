import { z } from "zod";
import { pick } from "lodash-es";
import type { Route } from "./+types/route";

import { data } from "react-router";
import { googleOAuthLogin } from "~/.server/services/auth";
import { getSessionHandler } from "~/.server/libs/session";
import { getUserCredits } from "~/.server/services/credits";

const googleSchema = z.object({
  type: z.enum(["google"]),
  data: z.object({
    access_token: z.string().optional(),
    credential: z.string().optional(),
  }),
});

const passwordSchema = z.object({
  type: z.enum(["email"]),
  data: z.object({
    email: z.string(),
    password: z.string(),
  }),
});

const authSchema = z.discriminatedUnion("type", [googleSchema, passwordSchema]);

export const loader = async ({ request }: Route.LoaderArgs) => {
  const [session, { commitSession }] = await getSessionHandler(request);
  const user = session.get("user");

  let user_info: UserInfo | null = null;
  let credits = 0;
  if (user) {
    user_info = {
      name: user.nickname,
      email: user.email,
      avatar: user.avatar_url,
      created_at: user.created_at.valueOf(),
    };

    const { balance } = await getUserCredits(user);
    credits = balance;
  }

  return Response.json(
    { profile: user_info, credits },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export const action = async ({ request, context }: Route.ActionArgs) => {
  if (request.method.toLowerCase() !== "post") {
    throw new Response("Not Found", { status: 404 });
  }

  const raw = await request.json();
  const json = authSchema.parse(raw);

  if (json.type !== "google") throw Error("Unvalid login type");

  const [session, { commitSession }] = await getSessionHandler(request);

  const userInfo = await handleGoogleOAuth(
    json.data,
    context.cloudflare.env.GOOGLE_CLIENT_ID
  );

  const user = await googleOAuthLogin({
    profile: userInfo,
    request,
    session: session.id,
  });
  session.set("user", user);

  const { balance } = await getUserCredits(user);

  const user_info: UserInfo = {
    name: user.nickname,
    email: user.email,
    avatar: user.avatar_url,
    created_at: user.created_at.valueOf(),
  };

  return Response.json(
    {
      profile: user_info,
      credits: balance,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

interface GoogleTokenInfo extends GoogleUserInfo {
  iss: string;
  azp: string;
  aud: string;
  nbf: string;
  iat: string;
  exp: string;
  jti: string;
  alg: string;
  kid: string;
  typ: string;
}

const handleGoogleOAuth = async (
  data: z.infer<typeof googleSchema>["data"],
  client_id: string
) => {
  const { access_token, credential } = data;

  if (!access_token && !credential) {
    throw Error("Either access_token or credential must be provided");
  }
  let userInfo: GoogleUserInfo | null = null;
  if (access_token) userInfo = await getUserInfo(access_token);
  if (!userInfo && credential) {
    const token = await getTokenInfo(credential);
    if (token.aud !== client_id) {
      throw Error("Unvalid client");
    }
    userInfo = pick(token, [
      "sub",
      "name",
      "given_name",
      "picture",
      "email",
      "email_verified",
    ]);
  }

  if (!userInfo) throw Error("Failed to Login");
  return userInfo;
};

const getTokenInfo = async (token: string) => {
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
  );
  if (!res.ok) throw new Error("Invalid ID token");
  const payload = await res.json<GoogleTokenInfo>();

  return payload;
};

const getUserInfo = async (access_token: string) => {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch Google user info");

  const user = await res.json<GoogleUserInfo>();
  return user;
};
