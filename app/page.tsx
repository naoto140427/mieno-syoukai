import Hero from "@/components/Hero";
import News from "@/components/News";
import StrategicUnits from "@/components/StrategicUnits";
import { createClient } from "@/lib/supabase/server";
import { Unit } from "@/types/database";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user;

  const { data: units } = await supabase.from('units').select('*');

  return (
    <>
      <section id="hero">
        <Hero />
      </section>
      <StrategicUnits units={(units as Unit[]) || []} isAdmin={isAdmin} />
      <News isAdmin={isAdmin} />
    </>
  );
}
