"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import { createAdminSession, deleteAdminSession } from "./session";

export type LoginState = { error: string | null };

function digest(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const submittedPassword = formData.get("password");
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (typeof submittedPassword !== "string" || submittedPassword.length === 0) {
    return { error: "Enter the admin password." };
  }

  if (!configuredPassword) {
    console.error("ADMIN_PASSWORD is not configured");
    return { error: "Admin login is not configured." };
  }

  if (!timingSafeEqual(digest(submittedPassword), digest(configuredPassword))) {
    return { error: "That password is incorrect. Try again." };
  }

  try {
    await createAdminSession();
  } catch (error) {
    console.error("Unable to create admin session", error);
    return { error: "Admin login is not configured." };
  }

  redirect("/admin/");
}

export async function logoutAction() {
  await deleteAdminSession();
  redirect("/admin/login/");
}
