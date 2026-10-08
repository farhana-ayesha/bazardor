"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const Signup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const confirm = form.get("confirm") as string;

    if (password.length < 8) return toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    if (password !== confirm) return toast.error("পাসওয়ার্ড মিলছে না");

    setLoading(true);
    const { error } = await authClient.signUp.email({ name, email, password });
    setLoading(false);

    if (error) return toast.error(error.message || "কিছু ভুল হয়েছে");
    toast.success("অ্যাকাউন্ট তৈরি হয়েছে!");
    router.push("/");
  };

  const socialLogin = async (provider: "google" | "github") => {
    await authClient.signIn.social({ provider, callbackURL: "/" });
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-700";

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-center text-3xl font-bold">অ্যাকাউন্ট তৈরি করুন</h1>
      <p className="mt-2 text-center text-sm text-gray-500">
        বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block font-medium">নাম</label>
          <input name="name" required placeholder="যেমন: রহিম উদ্দিন" className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block font-medium">ইমেইল</label>
          <input name="email" type="email" required placeholder="you@example.com" className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block font-medium">পাসওয়ার্ড</label>
          <input name="password" type="password" required placeholder="কমপক্ষে ৮ অক্ষর" className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block font-medium">পাসওয়ার্ড নিশ্চিত করুন</label>
          <input name="confirm" type="password" required placeholder="আবার লিখুন" className={inputClass} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
        >
          {loading ? "অপেক্ষা করুন..." : "অ্যাকাউন্ট তৈরি করুন"}
        </button>
      </form>

      <div className="my-5 text-center text-sm text-gray-400">অথবা</div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => socialLogin("google")} className="rounded-lg border border-gray-200 py-3 hover:bg-gray-50">
          Google দিয়ে চালিয়ে যান
        </button>
        <button onClick={() => socialLogin("github")} className="rounded-lg border border-gray-200 py-3 hover:bg-gray-50">
          GitHub দিয়ে চালিয়ে যান
        </button>
      </div>

      <p className="mt-6 text-center text-sm">
        অ্যাকাউন্ট আছে?{" "}
        <Link href="/signin" className="font-medium text-green-700 underline">
          সাইন ইন করুন
        </Link>
      </p>
      <p className="mt-4 text-center text-sm">
        <Link href="/" className="text-gray-500">← হোম পেজে ফিরে যান</Link>
      </p>
    </div>
  );
};

export default Signup;