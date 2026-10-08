"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SigninPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    setLoading(true);
    const res = await authClient.signIn.email({ email, password });
    setLoading(false);

    if (res.error) {
      toast.error(res.error.message || "ইমেইল বা পাসওয়ার্ড ভুল");
    } else {
      toast.success("সাইন ইন সফল হয়েছে");
      router.push("/");
    }
  }

  async function handleSocial(provider: "google" | "github") {
    await authClient.signIn.social({ provider, callbackURL: "/" });
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center">সাইন ইন করুন</h1>
      <p className="text-center text-gray-500 mt-2">
        আপনার অ্যাকাউন্টে ঢুকে সব দাম দেখুন।
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block mb-1 font-medium">ইমেইল</label>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-green-700"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">পাসওয়ার্ড</label>
          <input
            name="password"
            type="password"
            required
            placeholder="পাসওয়ার্ড লিখুন"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-green-700"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-60"
        >
          {loading ? "অপেক্ষা করুন..." : "সাইন ইন"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 my-5">অথবা</p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleSocial("google")}
          className="border border-gray-200 rounded-lg py-3 hover:bg-gray-50"
        >
          Google দিয়ে চালিয়ে যান
        </button>
        <button
          onClick={() => handleSocial("github")}
          className="border border-gray-200 rounded-lg py-3 hover:bg-gray-50"
        >
          GitHub দিয়ে চালিয়ে যান
        </button>
      </div>

      <p className="text-center text-sm mt-6">
        অ্যাকাউন্ট নেই?{" "}
        <Link href="/signup" className="text-green-700 font-medium underline">
          সাইন আপ করুন
        </Link>
      </p>
    </div>
  );
}