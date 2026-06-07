import Image from "next/image";
import Link from "next/link";

export function CTABanner() {
  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="relative bg-[#1a1b23] rounded-2xl overflow-hidden px-6 sm:px-12 py-10 sm:py-16 min-h-[180px] sm:min-h-[255px] flex items-center justify-center">
        <div className="absolute top-[-38px] left-0 sm:left-[22px] w-24 sm:w-40 h-[200px] sm:h-[259px] hidden sm:block">
          <Image src="/figmaAssets/vector-3.svg" alt="Decoration" fill className="object-contain" />
        </div>
        <div className="absolute bottom-0 right-4 sm:right-8 w-20 sm:w-[140px] h-[140px] sm:h-[185px] hidden sm:block opacity-50">
          <Image src="/figmaAssets/vector-1.svg" alt="Decoration" fill className="object-contain" />
        </div>
        <div className="relative z-10 w-full  mx-auto">
          <section className="relative overflow-hidden bg-[#0F1320] py-20">
            {/* Left Ethereum Shape */}
            <div className="absolute left-0 top-0 opacity-10">
              <div className="w-52 h-52 bg-gradient-to-b from-white to-transparent clip-path-ethereum" />
            </div>

            {/* Right Bitcoin Symbol */}
            <div className="absolute right-10 bottom-0 text-[220px] font-bold text-white/5 leading-none">
              ₿
            </div>

            <div className="container mx-auto px-6">
              <div className="flex flex-col items-center text-center">
                <h2 className="text-4xl md:text-6xl font-bold text-white">
                  Ready to Start Trading?
                </h2>

                <p className="mt-6 max-w-2xl text-lg md:text-2xl text-gray-300">
                  Join thousands of users buying and selling
                  <br />
                  crypto securely.
                </p>

                <Link
                  href="/signup"
                  className="mt-10 inline-flex rounded-full bg-gradient-to-r from-purple-600 to-violet-500 px-12 py-5 text-lg font-semibold text-white transition hover:scale-105"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
