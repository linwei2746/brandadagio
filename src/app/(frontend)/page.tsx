import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import OurMessage from "@/components/OurMessage";
import ServicesBar from "@/components/ServicesBar";
import Collection from "@/components/Collection";
import Features from "@/components/Features";
import Appraiser from "@/components/Appraiser";
import SellCTA from "@/components/SellCTA";
import Journal from "@/components/Journal";
import Stores from "@/components/Stores";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <OurMessage />
        <ServicesBar />
        <Collection />
        <Features />
        <Appraiser />
        <SellCTA />
        <Journal />
        <Stores />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
