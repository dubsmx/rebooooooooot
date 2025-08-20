import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EventsPopular from "@/components/EventsPopular";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import MidCta from "../components/MidCta";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Navbar />
      <main id="hero-root" className="pt-16">
        <Hero />
        <section id="conciertos" className="section"></section>
        <section id="deportes" className="section"></section>
        <section id="ciudades" className="section"></section>

        <EventsPopular />
        <HowItWorks />
        <Benefits />
        <Testimonials />
        <MidCta />
        <FAQ />

        <section id="vender" className="section mx-auto max-w-7xl px-4 py-8"></section>
        <section id="soporte" className="section mx-auto max-w-7xl px-4 py-8"></section>
        <section id="login" className="section mx-auto max-w-7xl px-4 py-8"></section>
        <section id="signup" className="section mx-auto max-w-7xl px-4 py-8"></section>
      </main>
      <Footer />
    </>
  );
}