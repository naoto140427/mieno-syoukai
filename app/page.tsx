import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MienoEcosystem from "@/components/MienoEcosystem";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        {/* Heroセクション */}
        <Hero />

        {/* Ecosystemセクション */}
        <MienoEcosystem />
      </main>
      <Footer />
    </div>
  );
}
