import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MienoEcosystem from "@/components/MienoEcosystem";
import History from "@/components/History";
import Logistics from "@/components/Logistics";
import PerformanceReport from "@/components/PerformanceReport";
import StrategicUnits from "@/components/StrategicUnits";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        {/* Heroセクション */}
        <section id="hero">
          <Hero />
        </section>

        {/* Strategic Units セクション */}
        <section id="units">
          <StrategicUnits />
        </section>

        {/* Ecosystemセクション */}
        <section id="ecosystem">
          <MienoEcosystem />
        </section>

        {/* Historyセクション */}
        <section id="history">
          <History />
        </section>

        {/* Logisticsセクション */}
        <section id="logistics">
          <Logistics />
        </section>

        {/* IR Informationセクション */}
        <section id="performance">
          <PerformanceReport />
        </section>
      </main>
      <Footer />
    </div>
  );
}
