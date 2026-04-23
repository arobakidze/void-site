import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import TextReveal from "@/components/TextReveal";
import FeatureCards from "@/components/FeatureCards";
import Showcase from "@/components/Showcase";
import StatsRow from "@/components/StatsRow";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main className="relative">
      <Hero />
      <Marquee />
      <TextReveal
        sub="Manifesto"
        text="Every detail is intentional. Every motion, a feeling. This is what happens when design speaks for itself."
      />
      <FeatureCards />
      <TextReveal
        sub="Chapter 02"
        text="Keep going. The best experiences reveal themselves slowly, one layer at a time."
      />
      <Showcase />
      <StatsRow />
      <Footer />
    </main>
  );
}
