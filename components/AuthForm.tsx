"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AuthForm({ mode }: { mode: "in" | "up" }) {
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (f.password.length < 8) return toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    setBusy(true);
    const { error } = mode === "in"
      ? await authClient.signIn.email({ email: f.email, password: f.password })
      : await authClient.signUp.email({ name: f.name, email: f.email, password: f.password });
    setBusy(false);
    if (error) return toast.error(error.message ?? "কিছু ভুল হয়েছে");
    if (mode === "in") { toast.success("সফলভাবে সাইন ইন হয়েছে"); router.push("/"); }
    else { toast.success("রেজিস্ট্রেশন সফল! এখন সাইন ইন করুন"); router.push("/signin"); }
  };

  const social = (provider: "google" | "github") =>
    authClient.signIn.social({ provider, callbackURL: "/" });

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto bg-white rounded-2xl border border-base-300 p-6 flex flex-col gap-3">
      <h1 className="text-2xl font-bold text-center">{mode === "in" ? "সাইন ইন" : "সাইন আপ"}</h1>
      {mode === "up" && (
        <input className="input input-bordered w-full" placeholder="নাম" required
          value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      )}
      <input type="email" className="input input-bordered w-full" placeholder="ইমেইল" required
        value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <input type="password" className="input input-bordered w-full" placeholder="পাসওয়ার্ড" required
        value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
      <button disabled={busy} className="btn btn-primary">
        {busy ? "অপেক্ষা করুন..." : mode === "in" ? "সাইন ইন" : "সাইন আপ"}
      </button>
      <button type="button" onClick={() => social("google")} className="btn btn-outline">Google দিয়ে চালিয়ে যান</button>
      <button type="button" onClick={() => social("github")} className="btn btn-outline">GitHub দিয়ে চালিয়ে যান</button>
      <p className="text-center text-sm">
        {mode === "in"
          ? <>অ্যাকাউন্ট নেই? <Link className="link" href="/signup">সাইন আপ</Link></>
          : <>অ্যাকাউন্ট আছে? <Link className="link" href="/signin">সাইন ইন</Link></>}
      </p>
    </form>
  );
}