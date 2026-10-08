"use client";
import { useEffect, useState } from "react";

const BASES = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];
const BN = "০১২৩৪৫৬৭৮৯";

export const toBn = (n: number | string) => String(n).replace(/\d/g, (d) => BN[+d]);
export const money = (n: number) => toBn(n.toLocaleString("en-US")) + " টাকা";
export const bnDate = () =>
  new Date().toLocaleDateString("bn-BD", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

// প্রথম API কাজ না করলে দ্বিতীয়টা চেষ্টা করে
async function getJSON(path: string) {
  for (const b of BASES) {
    try {
      const r = await fetch(b + path);
      if (r.ok) return await r.json();
    } catch {}
  }
  throw new Error("API error");
}

const unwrap = (j: any) => (Array.isArray(j) ? j : j.data ?? j);

const UNITS: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  liter: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
  pcs: "প্রতি পিস",
  pc: "প্রতি পিস",
};

export const normProduct = (p: any) => {
  const pct = Number(p.change?.pct ?? 0);
  const signed = p.change?.dir === "up" ? pct : p.change?.dir === "down" ? -pct : 0;
  return {
    id: String(p.id),
    slug: p.slug ?? "",
    name: p.nameBn ?? "",
    emoji: p.image ?? p.categoryIcon ?? "🛒",
    unit: UNITS[String(p.unit).toLowerCase()] ?? p.unit ?? "",
    category: p.categoryNameBn ?? p.category ?? "",
    price: Number(p.today ?? 0),
    yesterday: Number(p.yesterday ?? 0),
    lastWeek: Number(p.lastWeek ?? 0),
    lastMonth: Number(p.lastMonth ?? 0),
    change: signed,
    markets: (p.markets ?? []).map((m: any) => ({
      name: m.market ?? "",
      division: m.division ?? "",
      min: Number(m.min ?? 0),
      max: Number(m.max ?? 0),
    })),
  };
};

export const normCat = (c: any) => ({
  slug: String(c.slug ?? c.id),
  name: c.nameBn ?? c.slug,
  icon: c.icon ?? "",
});

export function useData<T>(path: string, map: (x: any) => T) {
  const [state, setState] = useState<{ path: string; data?: T; error?: boolean } | null>(null);

  useEffect(() => {
    let live = true;
    getJSON(path)
      .then((j) => live && setState({ path, data: map(j) }))
      .catch(() => live && setState({ path, error: true }));
    return () => {
      live = false;
    };
  }, [path]);

  const cur = state?.path === path ? state : null;
  return { data: cur?.data ?? null, loading: !cur, error: !!cur?.error };
}

export const useProducts = (q = "") => useData("/products" + q, (j) => unwrap(j).map(normProduct));
export const useCategories = () => useData("/categories", (j) => unwrap(j).map(normCat));
export const useProduct = (id: string) =>
  useData("/products/" + id, (j) => normProduct(j.data ?? j));