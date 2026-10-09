"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useProduct, useCategories, toBn } from "@/lib/api";
import { Badge } from "@/components/ui";

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { data: p, loading } = useProduct(slug as string);
  const { data: cats } = useCategories();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [isPending, session, router]);

  if (isPending || !session || loading) {
    return <p className="py-20 text-center">লোড হচ্ছে...</p>;
  }

  if (!p) {
    return <p className="py-20 text-center">পণ্যটি পাওয়া যায়নি</p>;
  }

  const cat = cats?.find((c: any) => c.slug === p.category);
  const markets = p.markets ?? [];

  const lowest = markets.length ? Math.min(...markets.map((m: any) => m.min)) : p.price;
  const highest = markets.length ? Math.max(...markets.map((m: any) => m.max)) : p.price;

  const oldPrice = p.price / (1 + p.change / 100);
  const diff = Math.round(Math.abs(p.price - oldPrice));
  const unitShort = p.unit.replace("প্রতি ", "");

  let message = "গতকালের মতোই দাম আছে";
  if (p.change > 0) message = `গতকালের তুলনায় আজ দাম বেড়েছে · ${toBn(diff)} টাকা`;
  if (p.change < 0) message = `গতকালের তুলনায় আজ দাম কমেছে · ${toBn(diff)} টাকা`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-green-700">হোম</Link>
        <span>›</span>
        <Link href={`/category/${p.category}`} className="hover:text-green-700">
          {cat?.name}
        </Link>
        <span>›</span>
        <span className="text-gray-700">{p.name}</span>
      </div>

      <div className="bg-white rounded-2xl shadow p-8 mt-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-100 grid place-items-center text-5xl">
            {p.emoji}
          </div>
          <div>
            <h1 className="text-4xl font-bold">{p.name}</h1>
            <p className="text-gray-500 mt-1">
              {p.unit} · {cat?.name}
            </p>
            <p className="text-gray-700 mt-3">{message}</p>
          </div>
        </div>

        <div className="border border-gray-100 bg-gray-50 rounded-xl px-8 py-5 text-center">
          <p className="text-sm text-gray-500">আজকের দাম</p>
          <p className="text-5xl font-bold my-1">{toBn(p.price)}</p>
          <p className="text-sm text-gray-500">টাকা / {unitShort}</p>
          <div className="mt-2">
            <Badge v={p.change} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-8 mt-6">
        <h2 className="text-2xl font-bold mb-5">দামের সারসংক্ষেপ</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="border border-gray-100 rounded-xl p-5">
            <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>
            <p className="mt-1 text-green-700 font-bold">
              <span className="text-3xl">{toBn(lowest)}</span>{" "}
              <span className="text-lg">টাকা</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">সবচেয়ে কম দামের বাজার</p>
          </div>

          <div className="border border-gray-100 rounded-xl p-5">
            <p className="text-sm text-gray-500">সর্বাধিক দাম</p>
            <p className="mt-1 text-red-600 font-bold">
              <span className="text-3xl">{toBn(highest)}</span>{" "}
              <span className="text-lg">টাকা</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">সবচেয়ে বেশি দামের বাজার</p>
          </div>

          <div className="border border-gray-100 rounded-xl p-5">
            <p className="text-sm text-gray-500">গড় দাম</p>
            <p className="mt-1 text-green-700 font-bold">
              <span className="text-3xl">{toBn(p.price)}</span>{" "}
              <span className="text-lg">টাকা</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">{p.unit}-এর হিসাবে</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-8 mt-6">
        <h2 className="text-2xl font-bold mb-5">বাজারভিত্তিক আজকের দাম</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b border-gray-200">
                <th className="py-3 font-medium">বাজার</th>
                <th className="py-3 font-medium">বিভাগ</th>
                <th className="py-3 font-medium">সর্বনিম্ন</th>
                <th className="py-3 font-medium">সর্বাধিক</th>
                <th className="py-3 font-medium text-right">গড়</th>
              </tr>
            </thead>
            <tbody>
  {markets.map((m: any, i: number) => {
    const avg = (m.min + m.max) / 2;
    const avgText = Number.isInteger(avg) ? avg : avg.toFixed(2);

    return (
      <tr key={i} className="border-b border-gray-100">
        <td className="py-4">{m.name}</td>
        <td className="py-4">{m.division}</td>
        <td className="py-4">{toBn(m.min)} টাকা</td>
        <td className="py-4">{toBn(m.max)} টাকা</td>
        <td className="py-4 text-right font-semibold">{toBn(avgText)} টাকা</td>
      </tr>
    );
  })}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}