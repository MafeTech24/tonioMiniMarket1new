import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import Ofertas from "@/components/Ofertas";
import WaveDivider from "@/components/WaveDivider";
import Catalogo from "@/components/Catalogo";
import Horarios from "@/components/Horarios";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import SearchBanner from "@/components/SearchBanner";
import { Cart } from "@/components/Cart";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen">
      <Navbar />
      <SearchBanner searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {searchTerm.trim() === "" && (
        <>
          <Hero />
          <TrustStrip />
          <WaveDivider color="secondary" flip />
        </>
      )}
      <Ofertas searchTerm={searchTerm} />
      {searchTerm.trim() === "" && (
        <WaveDivider color="primary" />
      )}
      <Catalogo searchTerm={searchTerm} />
      {/* <Galeria /> */}
      <Horarios />
      <FAQ />
      <Footer />
      <WhatsAppFAB />
      <Cart isFloating />
    </div>
  );
};

export default Index;
