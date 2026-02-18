import Hero from "@/components/Hero";
import News from "@/components/News";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user;

  return (
    <>
      <section id="hero">
        <Hero />
      </section>
      <News isAdmin={isAdmin} />
    </>
  );
}
