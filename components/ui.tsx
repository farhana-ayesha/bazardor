"use client";
import Link from "next/link";
import { toBn, money } from "@/lib/api";

// Figma: ▲ বেড়েছে = লাল, ▼ কমেছে = সবুজ
export function Badge({ v }: { v: number }) {
  const c = v > 0 ? "text-red-600" : v < 0 ? "text-green-600" : "text-gray-500";
  return (
    <span className={`text-sm font-semibold ${c}`}>
      {v > 0 ? "▲" : v < 0 ? "▼" : "—"} {toBn(Math.abs(v).toFixed(1))}%
    </span>
  );
}

export function Card({ p }: { p: any }) {
  return (
    <Link href={`/product/${p.id}`} className="block bg-white rounded-2xl border border-base-300 p-4 hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <span className="text-4xl">{p.emoji}</span>
        <div>
          <h3 className="font-bold">{p.name}</h3>
          <p className="text-sm text-gray-500">{p.unit}</p>
        </div>
      </div>
      <div className="flex justify-between items-end mt-4">
        <div>
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <p className="text-xl font-bold">{money(p.price)}</p>
        </div>
        <Badge v={p.change} />
      </div>
    </Link>
  );
}

export const Skeletons = ({ n = 6 }: { n?: number }) => (
  <>{Array.from({ length: n }).map((_, i) => <div key={i} className="skeleton h-32 w-full rounded-2xl" />)}</>
);

export const Grid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
);