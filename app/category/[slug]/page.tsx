"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCategories, useProducts, toBn } from "@/lib/api";
import { Badge } from "@/components/ui";

export default function CategoryPage() {
  const { slug } = useParams();
  const [sort, setSort] = useState("default");
  const { data: cats } = useCategories();
  const { data: prods, loading: isLoading } = useProducts(`?category=${slug}`);

  const category = cats?.find((c: any) => c.slug === slug);

  let items = prods ?? [];

  if (sort === "low") {
    items = [...items].sort((a: any, b: any) => a.price - b.price);
  } else if (sort === "high") {
    items = [...items].sort((a: any, b: any) => b.price - a.price);
  } else if (sort === "change") {
    items = [...items].sort((a: any, b: any) => b.change - a.change);
  }

  if (isLoading || !prods) {
    
   return (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="skeleton h-28 rounded-2xl"></div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="skeleton h-40 rounded-2xl"></div>
      ))}
    </div>
  </div>
);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
        <span className="text-5xl">{category?.icon}</span>
        <div>
          <h1 className="text-3xl font-bold">{category?.name}</h1>
          <p className="text-gray-500">
            {toBn(items.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 mt-6 flex justify-end items-center gap-3">
        <span className="text-gray-600">সাজান</span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 outline-none"
        >
          <option value="default">ডিফল্ট</option>
          <option value="low">দাম: কম থেকে বেশি</option>
          <option value="high">দাম: বেশি থেকে কম</option>
          <option value="change">পরিবর্তন: বেশি থেকে কম</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mt-6">
        মোট {toBn(items.length)}টি পণ্য দেখানো হচ্ছে
      </p>

      {items.length === 0 ? (
        <p className="text-center py-16 text-gray-500">কোনো পণ্য পাওয়া যায়নি</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {items.map((p: any) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="bg-white rounded-2xl shadow p-5 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl">{p.emoji}</span>
                <div>
                  <h2 className="font-semibold text-lg">{p.name}</h2>
                  <p className="text-sm text-gray-500">{p.unit}</p>
                </div>
              </div>

              <div className="flex items-end justify-between mt-6">
                <div>
                  <p className="text-sm text-gray-500">আজকের দাম</p>
                  <p className="text-2xl font-bold">{toBn(p.price)} টাকা</p>
                </div>
                <Badge v={p.change} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}