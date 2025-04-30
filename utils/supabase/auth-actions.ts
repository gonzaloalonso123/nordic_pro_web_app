"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Database } from "../database.types";
import { toPostgresTimestamp } from "../utils";
import { createClient } from "./server";

export async function signIn(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { user: data.user, session: data.session };
}

export async function signUp(
  email: string,
  password: string,
  metadata: {
    firstName: string;
    lastName: string;
    gender: "MAN" | "WOMAN";
    address: string;
    birthDate: Date;
  }
) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        first_name: metadata.firstName,
        last_name: metadata.lastName,
        email: email,
        gender: metadata.gender,
        address: metadata.address,
        birth_date: toPostgresTimestamp(metadata.birthDate),
      },
    },
  });

  if (error) {
    console.log(error.message);
    return { error: error.message };
  }
  return { user: data.user, session: data.session };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function resetPassword(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updatePassword(password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function getCurrentSession() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    return null;
  }

  return data.session;
}

export async function getCurrentUser() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function requireAuth() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
