"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { login } from "@/lib/store/userSlice";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      alert(result.error);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700  font-semibold py-3 rounded-lg transition-colors"
          >
            Sign in
          </button>

          <div className="my-6 flex inline-flex">
            <div className="inset-0 flex items-center">
              <div className="w-34 border-t border-gray-300 z-10"></div>
              <div className="relative flex justify-center text-sm">
                <span className="px-1 text-gray-500 z-40">
                  or continue with
                </span>
              </div>
              <div className="w-34 border-t border-gray-300 z-10"></div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => signIn("google")}
              className="flex font-bold items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full"
            >
              <Image
                src="/icons/googlew.svg"
                alt="Google"
                height={12}
                width={10}
                className="w-10 h-10"
              />
              <span className="text-black">Google</span>
            </button>
            <button
              type="button"
              onClick={() => signIn("github")}
              className="flex font-bold items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full"
            >
              <Image
                src="/icons/githubs.svg"
                alt="GitHub"
                height={12}
                width={10}
                className="w-10 h-12"
              />
              <span className="text-black">Github</span>
            </button>
            <button
              type="button"
              onClick={() => signIn("twitter")}
              className="flex font-bold items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full"
            >
              <Image
                src="/icons/twitter.svg"
                alt="Twitter"
                height={12}
                width={10}
                className="w-10 h-12"
              />
              <span className="text-black">Twitter</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
