"use client";

import { signOut } from "next-auth/react";
import { useAppDispatch } from "@/lib/store/hooks";
import { logout } from "@/lib/store/userSlice";

export default function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    dispatch(logout());
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  return (
    <button
      onClick={handleLogout}
      className="px-1 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition-colors"
    >
      Logout
    </button>
  );
}
