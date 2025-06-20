import { env } from "cloudflare:workers";
import {
  getUserAuthByProvider,
  insertUserAuth,
} from "~/.server/model/user_auth";
import { getUserByEmail, insertUser } from "~/.server/model/user";
import { insertSigninLog } from "~/.server/model/signin_log";
import type { User, InsertUser, InsertUserAuth } from "~/.server/libs/db";

import { insertCreditRecord } from "~/.server/model/credit_record";

export const createUser = async (newUser: InsertUser) => {
  const [createdUser] = await insertUser(newUser);
  if (env.INITLIZE_CREDITS) {
    await insertCreditRecord({
      user_id: createdUser.id,
      credits: env.INITLIZE_CREDITS,
      remaining_credits: env.INITLIZE_CREDITS,
      trans_type: "initilize",
    });
  }

  return createdUser;
};
/**
 * Google OAuth 登录流程
 * @param profile 从 Google OAuth 获取的用户资料
 */
export const googleOAuthLogin = async (params: {
  profile: GoogleUserInfo;
  request: Request;
  session: string;
}) => {
  const { session, profile, request } = params;

  const provider = "google";
  const { sub: openid, email, name, picture: avatar } = profile;

  // 1. 查询是否有同 email 的用户，有则赋值，无则 insert
  let user: User | null = null;
  const result = await getUserByEmail(email);
  if (!result) {
    const newUser: InsertUser = {
      email,
      nickname: name,
      avatar_url: avatar,
    };
    user = await createUser(newUser);
  } else {
    user = result;
  }

  // 2. 查询该 provider 是否进行了绑定，未绑定则写记录关联
  const userAuth = await getUserAuthByProvider(provider, openid);
  if (!userAuth) {
    const newAuth: InsertUserAuth = {
      user_id: user.id,
      provider,
      openid,
    };
    await insertUserAuth(newAuth);
  }

  // 3. 记录登录日志
  const ip = request.headers.get("x-real-ip");
  const ua = request.headers.get("user-agent");
  const headers = Object.fromEntries(request.headers.entries());
  await insertSigninLog({
    session: session,
    user_id: user.id,
    type: provider,
    ip,
    user_agent: ua,
    headers,
  });

  return user;
};
