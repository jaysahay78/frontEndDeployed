"use client";

import netflixLogo from "@/assets/netlfix.png";
import adobeLogo from "@/assets/adoobie.png";
import metaLogo from "@/assets/meta.png";
import amazonLogo from "@/assets/amazon.png";
import samsungLogo from "@/assets/samsung.png";
import googleLogo from "@/assets/google.png";
import walmartLogo from "@/assets/walmart.png";
import Image from "next/image";
import { motion } from "framer-motion";

export const LogoTicker = () => {
  return <div className="py-8 md:py-12 bg-white ">
    <div className="w-full max-w-[1400px] mx-auto px-20">
      <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
        <motion.div className="flex gap-14 flex-none pr-14"
        animate={{
          translateX: "-50%",
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        >
          <Image src={samsungLogo} alt="samsung" className="logo-ticker-image"/>
          <Image src={adobeLogo} alt="adobe" className="logo-ticker-image"/>
          <Image src={metaLogo} alt="meta" className="logo-ticker-image"/>
          <Image src={amazonLogo} alt="amazon" className="logo-ticker-image"/>
          <Image src={netflixLogo} alt="netflix" className="logo-ticker-image"/>
          <Image src={googleLogo} alt="google" className="logo-ticker-image" />
          <Image src={walmartLogo} alt="walmart" className="logo-ticker-image" />
        

          <Image src={samsungLogo} alt="samsung" className="logo-ticker-image"/>
          <Image src={adobeLogo} alt="adobe" className="logo-ticker-image"/>
          <Image src={metaLogo} alt="meta" className="logo-ticker-image"/>
          <Image src={amazonLogo} alt="amazon" className="logo-ticker-image"/>
          <Image src={netflixLogo} alt="netflix" className="logo-ticker-image"/>
          <Image src={googleLogo} alt="google" className="logo-ticker-image" />
          <Image src={walmartLogo} alt="walmart" className="logo-ticker-image" />
        </motion.div>
      </div>
    </div>
  </div>
};
