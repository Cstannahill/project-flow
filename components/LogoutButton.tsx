"use client";

import { signOut } from "next-auth/react";
import { useAppDispatch } from "@/lib/store/hooks";
import { logout } from "@/lib/store/users/slice";

export default function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/" });
    dispatch(logout());
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1.5 bg-red-500/75 text-white rounded hover:bg-red-800 transition-colors"
      style={{ borderRadius: "0.575rem" }}
    >
      Logout
    </button>
  );
}
