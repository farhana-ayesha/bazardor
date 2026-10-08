"use client";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useProduct, money } from "@/lib/api";
import { Badge } from "@/components/ui";

export default function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { data: p, loading, error } = useProduct(slug);

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("এই পেজ দেখতে সাইন ইন করুন");
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  if (isPending || !session || loading) return <div className="skeleton h-72 w-full rounded-2xl" />;

  if (error || !p)
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">৪০৪ — পণ্য পাওয়া যায়নি</h2>
        <Link href="/" className="btn btn-primary">হোম পেজে ফিরে যান</Link>
      </div>
    );

  const mins = p.markets.map((m: any) => m.min);
  const maxs = p.markets.map((m: any) => m.max);
  const min = mins.length ? Math.min(...mins) : p.price;
  const max = maxs.length ? Math.max(...maxs) : p.price;
  const avg = p.markets.length
    ? Math.round(p.markets.reduce((s: number, m: any) => s + (m.min + m.max) / 2, 0) / p.markets.length)
    : p.price;

  const divisions = Array.from(new Set(p.markets.map((m: any) => m.division))) as string[];

  return (
    <>
      <div className="bg-white rounded-2xl border border-base-300 p-6">
        <h1 className="text-3xl font-bold">{p.emoji} {p.name}</h1>
        <p className="text-gray-500 my-2">
          গতকাল {money(p.yesterday)} · গত সপ্তাহে {money(p.lastWeek)} · গত মাসে {money(p.lastMonth)}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge badge-outline">{p.category}</span>
          <span className="badge">{p.unit}</span>
          <Badge v={p.change} />
        </div>
        <p className="mt-4 text-sm text-gray-500">আজকের দাম</p>
        <p className="text-3xl font-bold">{money(p.price)}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 my-6">
        {[["সর্বনিম্ন দাম", min], ["সর্বোচ্চ দাম", max], ["গড় দাম", avg]].map(([l, v]: any) => (
          <div key={l} className="bg-white rounded-2xl border border-base-300 p-4">
            <p className="text-sm text-gray-500">{l}</p>
            <p className="text-2xl font-bold">{money(v)}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-3">বাজারভিত্তিক আজকের দাম</h2>
      <div className="space-y-4">
        {divisions.map((d) => (
          <div key={d} className="bg-white rounded-2xl border border-base-300 overflow-x-auto">
            <h3 className="px-4 pt-3 font-semibold">{d}</h3>
            <table className="table">
              <tbody>
                {p.markets.filter((m: any) => m.division === d).map((m: any) => (
                  <tr key={m.name}>
                    <td>{m.name}</td>
                    <td className="text-right">{money(m.min)} – {money(m.max)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </>
  );
}