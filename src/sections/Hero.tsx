"use client";
import ArrowIcon from "@/assets/arrow-right.svg";
import cogImage from "@/assets/cog.png";
import BlurText from "@/components/BlurText";
import cylinderImage from "@/assets/cylinder.png";
import noodleImage from "@/assets/noodle.png";
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef } from "react";

export const Hero = () => {
  const heroRef = useRef(null);
  const {scrollYProgress} = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });



  return (
    <section ref={heroRef} className='pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_100%)] overflow-x-clip'>
      <div className="w-full max-w-[1400px] mx-auto px-20">
        <div className="md:flex items-center">
          <div className="md:w-[478px]">
            <div className="tag">
            Try Version 1.0!</div>
            <h1 >
              <BlurText
              text="Discover Ideas.
              Share Thoughts.
              Fuel Your Mind."
              delay={200}
              animateBy="words"
              direction="top"
              className="text-5xl md:text-7xl font-bold tracking-tighter mt-6"/>
            </h1>
            

            <p className="text-xl text-[#010D3E] tracking-tight mt-6">Welcome to your new favorite corner of the 
              internet — where writers, thinkers, and curious minds come together. From personal reflections to deep dives on tech, culture, and creativity — this is blogging, reimagined.
            </p>
            <div className="flex gap-1 items-center mt-[30px]">
              <button className="btn btn-primary">Sign Up</button>
              <button className="btn btn-text gap-1">
                <span>Learn more</span>
                <ArrowIcon className="h-5 w-5" />
                </button>
            </div>
          </div>
          <div className='mt-20 md:mt-0 md:h-[648px] flex justify-end w-full relative'>
            <div className="relative w-full max-w-[600px]">
              <motion.img src ={cogImage.src} alt= "Cog image" className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-5 animate-space-float-2" />
              <motion.img src={cylinderImage.src} alt="cylinder" width={220} height={220} className="hidden md:block -top-8 -left-32 md:absolute animate-space-float-1" />
              <motion.img src={noodleImage.src} alt="noodleimage" width={220} className="hidden lg:block absolute top-[524px] right-[-150px] rotate-[30deg] animate-space-float-3"
              style={{
                rotate: 30,
              }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
