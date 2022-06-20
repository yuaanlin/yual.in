import Link from 'next/link';
import SocialLinks from '../components/SocialLinks';

export default function () {
  return (
    <div className="min-h-screen">
      <div
        className="container 2xl:px-64 px-6 lg:px-32 mx-auto flex
       flex-row py-8 lg:pb-24 flex-wrap">
        <div className="mt-4 lg:mt-12">
          <Link href="/" scroll>
            <div
              className="font-extrabold text-xl lg:text-3xl mb-4 lg:mb-0
        cursor-pointer flex flex-row lg:flex-col items-baseline">
              <p className="mr-2">Yuanlin Lin</p>
              <p className="text-lg text-[#c9ada7]">Blog</p>
            </div>
          </Link>
          <SocialLinks />
        </div>
        <div className="w-full my-16">
          <h1 className="font-extrabold text-5xl">出事了阿伯！</h1>
          <p className="text-lg mt-12 mb-2 font-bold">你找到了一個不存在的頁面 ...</p>
          <p className="opacity-50 font-bold">You found a page which is not available now ...</p>
          <div className="mt-32">
            <p>可以的話，請告訴我你從哪裡發現這個頁面的，讓我可以修復這個問題 🙏</p>
          </div>
          <Link href="/">
            <a className="text-[#c9ada7] font-bold mt-8">回首頁</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
