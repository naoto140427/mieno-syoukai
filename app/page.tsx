import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import StrategicUnits from "@/components/StrategicUnits";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        {/* Heroセクション */}
        <Hero />

        {/* Strategic Units Section */}
        <StrategicUnits />
      </main>
      <Footer />
    </div>
  );
}
