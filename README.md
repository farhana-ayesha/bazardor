# 🛒 বাজার দর (BazarDor)

প্রয়োজনীয় পণ্যের দাম এক নজরে। চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার বাজারভিত্তিক দাম, গড়, সর্বনিম্ন, সর্বাধিক এবং দামের পরিবর্তন এক জায়গায় দেখার ওয়েব অ্যাপ।

🔗 **Live:** https://bazardor-gamma.vercel.app

## ✨ Features

- 📈 **লাইভ প্রাইস টিকার:** নেভবারের নিচে পণ্যের নাম, দাম ও ▲/▼ পরিবর্তনের ইনফিনিট স্ক্রলিং স্ট্রিপ
- 🔺🔻 **আজ দাম বেড়েছে / কমেছে:** হোম পেজে সবচেয়ে বেশি বাড়া ও কমা ৬টা করে পণ্য
- 🗂️ **ক্যাটেগরি পেজ ও সর্ট:** ক্যাটেগরি অনুযায়ী পণ্য, দাম অনুযায়ী সাজানোর সুবিধা
- 🔒 **প্রটেক্টেড প্রোডাক্ট ডিটেইল:** লগইন করলেই বাজারভিত্তিক দামের বিস্তারিত টেবিল দেখা যায়
- 🔐 **অথেন্টিকেশন:** BetterAuth দিয়ে ইমেইল/পাসওয়ার্ড, Google ও GitHub লগইন
- 👤 **ইউজার প্রোফাইল:** নাম আপডেট করার সুবিধা
- 📱 **সম্পূর্ণ রেসপনসিভ:** মোবাইল, ট্যাবলেট ও ডেস্কটপে সঠিকভাবে কাজ করে

## 🛠️ Technologies

- Next.js (App Router)
- TypeScript
- Tailwind CSS + DaisyUI
- BetterAuth
- MongoDB
- react-hot-toast

## 🚀 Run Locally

```bash
git clone https://github.com/farhana-ayesha/bazardor.git
cd bazardor
npm install
npm run dev
```

`.env` ফাইলে এগুলো দিতে হবে:

```
MONGODB_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```
