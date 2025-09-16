"use client";
import { useState } from "react";
import Bot from "@/components/ChatBot";
import { CallToAction } from "@/sections/CallToAction";
import { Footer } from "@/sections/Footer";
import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { LogoTicker } from "@/sections/LogoTicker";
import { Pricing } from "@/sections/Pricing";
import { ProductShowcase } from "@/sections/ProductShowcase";
import { Testimonials } from "@/sections/Testimonials";

export default function Home() {

  const [showChatbot, setShowChatbot] = useState(false);
  return(
  <>
  <Header />
  <Hero />
  <LogoTicker />
  <ProductShowcase />
  <Pricing />
  <Testimonials />
  <CallToAction />
  <Bot showChatbot={showChatbot} setShowChatbot={setShowChatbot} />
  <Footer />
  </>
  );
}
