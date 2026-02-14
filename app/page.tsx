import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        {/* ヒーローセクション（今回は簡易的） */}
        <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-mieno-navy sm:text-6xl">
              Logistics for the Future
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              株式会社三重野商会は、革新的な戦略と伝統的な価値観を融合させ、
              未踏の領域（主に峠道）へと突き進みます。
            </p>
          </div>
        </section>

        {/* スクロール確認用ダミーコンテンツ */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
          <div className="space-y-16">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm ring-1 ring-gray-900/5">
                <h3 className="text-lg font-semibold leading-8 tracking-tight text-mieno-navy">
                  Strategic Unit #{i + 1}
                </h3>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  高度な自律分散型組織により、迅速な意思決定と実行を可能にします。
                  特に、昼食の場所決定におけるスピード感は他社の追随を許しません。
                  我々のミッションは、あくまで安全かつ迅速に目的地へ到達し、
                  そして無事に帰還すること（家に帰るまでが遠足です）にあります。
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
