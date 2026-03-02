import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f0f0f0] mt-[50px]">
      <div className="px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-16 text-[12px]">
          <div>
            <h4 className="font-normal text-[12px] mb-6 uppercase tracking-wider">
              Join our newsletter
            </h4>
            <div className="flex items-center bg-white rounded-sm overflow-hidden">
              <input
                type="email"
                placeholder="E-mail address"
                className="flex-1 px-4 py-3 text-[12px] focus:outline-none bg-transparent border-none"
              />
              <button className="px-4 py-3 text-gray-400 text-lg">›</button>
            </div>
            <p className="text-[12px] text-gray-500 mt-4 leading-relaxed">
              You may unsubscribe at any time. To find out more, please visit
              our{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          <div>
            <h4 className="font-normal text-[12px] mb-1 uppercase tracking-wider">
              Help Center
            </h4>
            <div className="w-full h-[1px] bg-[#999999] mb-6"></div>
            <ul className="space-y-0 text-[12px]">
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/shipping">Shipping & Returns</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-normal text-[12px] mb-1 uppercase tracking-wider">
              Follow Us
            </h4>
            <div className="w-full h-[1px] bg-[#999999] mb-6"></div>
            <ul className="space-y-0 text-[12px]">
              <li>
                <a href="https://instagram.com" target="_blank">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://spotify.com" target="_blank">
                  Spotify
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-normal text-[12px] mb-1 uppercase tracking-wider">
              Policy
            </h4>
            <div className="w-full h-[1px] bg-[#999999] mb-6"></div>
            <ul className="space-y-0 text-[12px]">
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#999999] pt-10 flex items-center justify-between">
          <div>
            <Image
              src="/logo-footer.svg"
              alt="Wasted Talent United"
              width={100}
              height={75}
            />
          </div>
          <div className="text-[12px] text-gray-600">
            ©2026 Wasted Talent United - All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
}
