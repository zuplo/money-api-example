import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

const vars = {
  AUTH0_CLIENT_ID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  AUTH0_AUDIENCE: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
  AUTH0_ISSUER: process.env.NEXT_PUBLIC_AUTH0_ISSUER,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  ZUPLO_URL: process.env.ZUPLO_URL,
};

export function getRequiredEnvVar(name: keyof typeof vars): string {
  const val = vars[name];
  if (!val) {
    throw new Error(`The environment variable '${name}' must be set.`);
  }
  return val;
}
