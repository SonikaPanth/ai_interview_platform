"use server";
import { auth, db } from "@/firebase/admin";
import { UserRecord } from "firebase-admin/auth";
import { limit } from "firebase/firestore";
import { cookies } from "next/headers";
import { toast } from "sonner";

import { string, success } from "zod";

export async function signUp(params: SignUpParams) {
  const { uid, name, email, password } = params;
  try {
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists.Please sign in instead",
      };
    }

    await db.collection("users").doc(uid).set({
      name,
      email,
    });

    return {
      success: true,
      message: "Account created successfully.Please Sign In",
    };
  } catch (e: any) {
    console.log("Cannot create account", e);

    if (e.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    return {
      success: false,
      message: "Failed to create an account",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;
  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: "User doest not exists, Create an account instead ",
      };
    }
    await setSessionCookies(idToken);
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "Failed to Login account",
    };
  }
}

export async function setSessionCookies(idToken: string) {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  const cookieStore = await cookies();
  const SessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,
  });
  cookieStore.set("session", SessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const SessionCookie = cookieStore.get("session")?.value;

  if (!SessionCookie) return null;

  try {
    const decodeClaims = await auth.verifySessionCookie(SessionCookie, true);
    const userRecord = await db.collection("users").doc(decodeClaims.uid).get();

    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

export async function getInterviewByUserId(
  userId: String,
): Promise<Interview[] | null> {
  const interview = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interview.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams,
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;
  const interview = await db
    .collection("interviews")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return interview.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}
