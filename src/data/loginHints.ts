import type { User } from "@/types";

/** Shown on the login page only — real accounts come from the API after signup + approval. */
export const loginHintUsers: User[] = [
  {
    id: "u-admin",
    name: "System Admin",
    email: "admin@lms.local",
    role: "admin",
  },
];
