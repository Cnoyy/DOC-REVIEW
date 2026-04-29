"use server";

import { WorkOS } from "@workos-inc/node";
import { cookies } from "next/headers";

const workos = new WorkOS(process.env.WORKOS_API_KEY);
const clientId = process.env.WORKOS_CLIENT_ID!;

export async function loginUser(email: string, password: string) {
  try {
    const response = await workos.userManagement.authenticateWithPassword({
      clientId,
      email,
      password,
    });

    // Store a simple auth cookie so middleware knows we are logged in
    const cookieStore = await cookies();
    cookieStore.set("auth_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return {
      success: true,
      user: {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName || undefined,
        lastName: response.user.lastName || undefined,
      },
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return { success: false, error: error.message || "Failed to login" };
  }
}

export async function registerUser(email: string, password: string, username: string) {
  try {
    // 1. Create the user in WorkOS
    const user = await workos.userManagement.createUser({
      email,
      password,
      firstName: username,
      emailVerified: true, // For demo purposes, auto-verify email
    });

    return { success: true, user: { id: user.id, email: user.email } };
  } catch (error: any) {
    console.error("Register error:", error);
    return { success: false, error: error.message || "Failed to register" };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  return { success: true };
}
