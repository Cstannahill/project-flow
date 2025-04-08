"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/login");
      router.refresh();
    } else {
      setError(data.error || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center  mb-6">
          Create an Account
        </h1>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Sign Up
          </button>
        </form>

        <div className="my-6 flex inline-flex">
          <div className="inset-0 flex items-center">
            <div className="w-34 border-t border-gray-300 z-10"></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 z-40">or sign up with</span>
            </div>
            <div className="w-34 border-t border-gray-300 z-10"></div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => signIn("google")}
            className="flex font-bold items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-500 transition-colors w-full"
          >
            <Image
              src="/icons/googlew.svg"
              alt="Google"
              className="w-10 h-10"
            />
            Google
          </button>
          <button
            type="button"
            onClick={() => signIn("github")}
            className="flex font-bold items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-500 transition-colors w-full"
          >
            <Image
              src="/icons/githubs.svg"
              alt="GitHub"
              className="w-10 h-12"
            />
            GitHub
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
