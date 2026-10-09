"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !data) {
      router.push("/signin");
    }
  }, [isPending, data, router]);

  useEffect(() => {
    if (data) setName(data.user.name);
  }, [data]);

  if (isPending || !data) {
    return <p className="py-20 text-center">লোড হচ্ছে...</p>;
  }

  const user = data.user;

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    if (name.trim() === "") {
      toast.error("নাম দিতে হবে");
      return;
    }

    setSaving(true);
    const res = await authClient.updateUser({ name: name.trim() });
    setSaving(false);

    if (res.error) {
      toast.error("আপডেট করা যায়নি");
    } else {
      toast.success("প্রোফাইল আপডেট হয়েছে");
    }
  }

    async function handleLogout() {
  try {
    const res = await authClient.signOut();

    if (res.error) {
      toast.error("সাইন আউট করা যায়নি");
      return;
    }

    toast.success("সাইন আউট সফল হয়েছে");
    window.location.replace("/");
  } catch {
    toast.error("সাইন আউট করতে সমস্যা হয়েছে");
  }
}


  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">আমার প্রোফাইল</h1>
      <p className="text-gray-500 mt-1">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>

      <div className="mt-6 p-6 bg-white rounded-2xl shadow flex items-center justify-between">
        <div className="flex items-center gap-4">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-green-700 text-white text-3xl font-bold flex items-center justify-center">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="border border-red-400 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
        >
          সাইন আউট
        </button>
      </div>

      <form onSubmit={handleUpdate} className="mt-6 p-6 bg-white rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">তথ্য</h3>

        <label className="block mb-1 font-medium">নাম</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-green-700"
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full mt-5 bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-60"
        >
          {saving ? "আপডেট হচ্ছে..." : "আপডেট"}
        </button>
      </form>
    </div>
  );
}