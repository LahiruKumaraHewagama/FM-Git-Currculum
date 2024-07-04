"use server"
import { clerkClient } from "@clerk/nextjs/server";

export async function initiateRole(id:string, user_role:string) {
  // Update role in Clerk
  await clerkClient.users.updateUser(id,{
      publicMetadata: { role: user_role },
    }
  );
}
