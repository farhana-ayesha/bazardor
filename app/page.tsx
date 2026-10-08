"use client";
import { useProducts, bnDate, toBn } from "@/lib/api";
import { Card, Grid, Skeletons } from "@/components/ui";

function Section({ id, title, tone, sub, list, loading }: any) {
  return (
    <section id={id} className="mt-10 scroll-mt-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        {tone && <span className={tone}>{tone.includes("red") ? "▲" : "▼"}</span>}{title}
      </h2>
      {sub && <p className="text-gray-500 mt-1">{sub}</p>}
      <div className="mt-4"><Grid>{loading ? <Skeletons /> : list.map((p: any) => <Card key={p.id} p={p} />)}</Grid></div>
    </section>
  );
}

export default function Home() {
  const { data, loading } = useProducts();
  const all = data ?? [];
  const up = all.filter((p: any) => p.change > 0).sort((a: any, b: any) => b.change - a.change).slice(0, 6);
  const down = all.filter((p: any) => p.change < 0).sort((a: any, b: any) => a.change - b.change).slice(0, 6);

  return (
    <>
      <section className="bg-white rounded-3xl border border-base-300 p-6 md:p-10 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <span className="inline-block text-sm text-primary bg-green-50 rounded-full px-3 py-1">{bnDate()}</span>
          <h1 className="text-3xl md:text-5xl font-bold my-4">আজকের বাজারের দাম এক নজরে</h1>
          <p className="text-gray-500 mb-6">চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন, সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।</p>
          <a href="#সব-পণ্য" className="btn btn-primary">সব পণ্য দেখুন</a>
        </div>
        <div className="text-center text-[8rem] md:text-[10rem] leading-none">🧺</div>
      </section>

      <Section title="আজ দাম বেড়েছে" tone="text-red-600" list={up} loading={loading} />
      <Section title="আজ দাম কমেছে" tone="text-green-600" list={down} loading={loading} />
      <Section id="সব-পণ্য" title="সব পণ্য" sub={`মোট ${toBn(all.length)}টি পণ্য দেখানো হচ্ছে`} list={all} loading={loading} />
    </>
  );
}