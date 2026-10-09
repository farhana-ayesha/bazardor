import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <h1 className="text-6xl font-bold">৪০৪</h1>
      <p className="text-gray-500 my-4">দুঃখিত, পেজটি খুঁজে পাওয়া যায়নি</p>
      <Link href="/" className="btn btn-primary">হোম পেজে ফিরে যান</Link>
    </div>
  );
}