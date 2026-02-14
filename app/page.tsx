import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
<<<<<<< HEAD
=======
import StrategicUnits from "@/components/StrategicUnits";
>>>>>>> origin/phase1-initial-setup-7652132207238665624

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        {/* Heroセクション */}
        <Hero />

<<<<<<< HEAD
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
=======
        {/* Strategic Units Section */}
        <StrategicUnits />
>>>>>>> origin/phase1-initial-setup-7652132207238665624
      </main>
      <Footer />
    </div>
  );
}
