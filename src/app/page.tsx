import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import OurMessage from "@/components/OurMessage";
import ServicesBar from "@/components/ServicesBar";
import Collection from "@/components/Collection";
import Features from "@/components/Features";
import Appraiser from "@/components/Appraiser";
import Stores from "@/components/Stores";
import FAQ from "@/components/FAQ";
import Journal from "@/components/Journal";

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
        <Stores />
        <FAQ />
        <Journal />
      </main>
      <Footer />
    </>
  );
}
