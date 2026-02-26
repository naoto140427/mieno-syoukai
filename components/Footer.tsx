import Link from "next/link";

const footerNavigation = {
  solutions: [
    { name: "機動戦力", href: "/units" },
    { name: "広域兵站", href: "/logistics" },
    { name: "事業領域", href: "/services" },
  ],
  support: [
    { name: "運用実績 (IR)", href: "/ir" },
    { name: "ドキュメント", href: "/history" },
  ],
  company: [
    { name: "組織沿革", href: "/history" },
    { name: "ニュース", href: "/" },
    { name: "Doctrine (CEO Message)", href: "/doctrine" },
  ],
  legal: [
    { name: "プライバシーポリシー", href: "/legal/privacy" },
    { name: "利用規約", href: "/legal/terms" },
  ],
};

const finePrint = [
  "※1 走行データは理想的な路面状況下での数値であり、実際のバンク角はライダーの裁量に依存します。",
  "※2 代表・三重野匠による発言の98%は法的拘束力を持ちません。",
  "※3 当組織において「課長」は、実質的な最高意思決定権と全ロジスティクスを掌握する最重要ポストです。",
  "※4 補給拠点（道の駅）でのソフトクリーム購入は、プロジェクト完遂のための必須要件です。",
];

export default function Footer() {
  return (
    <footer className="bg-mieno-gray border-t border-gray-200" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid grid-cols-2 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-mieno-text">Solutions</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.solutions.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-xs leading-6 text-gray-600 hover:text-mieno-text hover:underline">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-mieno-text">Support</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.support.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-xs leading-6 text-gray-600 hover:text-mieno-text hover:underline">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-mieno-text">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-xs leading-6 text-gray-600 hover:text-mieno-text hover:underline">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-mieno-text">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-xs leading-6 text-gray-600 hover:text-mieno-text hover:underline">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 xl:mt-0">
             <p className="text-sm leading-6 text-gray-600">
                Strategic Headquarters<br/>
                Miyagawachi Base, Oita, Japan
             </p>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
          <ul className="list-none space-y-1 mb-8">
            {finePrint.map((text, index) => (
              <li key={index} className="text-[10px] text-gray-500 leading-4 tracking-tight">
                {text}
              </li>
            ))}
          </ul>
          <p className="text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} Mieno Corp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
