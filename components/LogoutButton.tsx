"use client";

import { signOut } from "next-auth/react";
import { useAppDispatch } from "@/lib/store/hooks";
import { logout } from "@/lib/store/userSlice";

export default function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    dispatch(logout()); // Clear Redux state
    await signOut({ redirect: true, callbackUrl: "/login" }); // Sign out from NextAuth and redirect
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition-colors"
    >
      Logout
    </button>
  );
}
