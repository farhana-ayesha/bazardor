"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { bnDate, useCategories, useProducts, toBn } from "@/lib/api";
import { Badge } from "./ui";

export default function Navbar() {
  const path = usePathname(), router = useRouter();
  const { data: session } = authClient.useSession();
  const { data: cats } = useCategories();
  const { data: prods } = useProducts();

  const out = async () => {
    await authClient.signOut();
    toast.success("সাইন আউট হয়েছে");
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-base-300">
      <div className="max-w-6xl mx-auto px-4 pt-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary grid place-items-center text-2xl">🛒</div>
          <div>
            <div className="font-bold text-xl leading-tight">বাজার দর</div>
            <div className="text-xs text-gray-500">{bnDate()}</div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link href="/profile" className="flex items-center gap-2">
                {session.user.image
                  ? <img src={session.user.image} alt="" className="w-9 h-9 rounded-full" />
                  : <span className="w-9 h-9 rounded-full bg-primary text-white grid place-items-center">{session.user.name?.[0]}</span>}
                <span className="hidden sm:block font-medium">{session.user.name}</span>
              </Link>
              <button onClick={out} className="btn btn-sm btn-outline">সাইন আউট</button>
            </>
          ) : (
            <>
              <Link href="/signin" className="btn btn-sm sm:btn-md btn-outline">সাইন ইন</Link>
              <Link href="/signup" className="btn btn-sm sm:btn-md btn-primary">সাইন আপ</Link>
            </>
          )}
        </div>
      </div>

      <nav className="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto md:justify-center">
        {cats?.map((c: any) => {
          const active = path === `/category/${c.slug}`;
          return (
            <Link key={c.slug} href={`/category/${c.slug}`}
              className={`btn btn-sm rounded-full whitespace-nowrap ${active ? "btn-primary" : "btn-ghost"}`}>
              {c.icon} {c.name}
            </Link>
          );
        })}
      </nav>

      {prods && (
        <div className="bg-base-200 overflow-hidden py-2 text-sm">
          <div className="marquee">
            {[...prods, ...prods].map((p: any, i: number) => (
              <span key={i} className="flex items-center gap-1 whitespace-nowrap mr-10">
                {p.emoji} {p.name} {toBn(p.price)} টাকা/{p.unit.replace("প্রতি ", "")} <Badge v={p.change} />
              </span>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}