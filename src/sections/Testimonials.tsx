"use client";

import avatar1 from "@/assets/avatar-1.png";
import avatar2 from "@/assets/avatar-2.png";
import avatar3 from "@/assets/avatar-3.png";
import avatar4 from "@/assets/avatar-4.png";
import avatar5 from "@/assets/avatar-5.png";
import avatar6 from "@/assets/avatar-6.png";
import avatar7 from "@/assets/avatar-7.png";
import avatar8 from "@/assets/avatar-8.png";
import avatar9 from "@/assets/avatar-9.png";

import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";

type Testimonial = {
  text: string;
  imageSrc: string;
  name: string;
  username: string;
};

const testimonials: Testimonial[] = [
  {
    text: "As a writer, I’ve tried countless platforms — but this one finally feels like home. Clean design, great tools, and a community that actually reads.",
    imageSrc: avatar1.src,
    name: "Arpitha Maralli",
    username: "@arpithaAM",
  },
  {
    text: "Since switching to this blog app, our content strategy has improved dramatically. Posting, editing, and engaging feels effortless.",
    imageSrc: avatar2.src,
    name: "Abhik Pandey",
    username: "@abhikakashi",
  },
  {
    text: "This platform has completely changed how I draft and publish my stories. It’s intuitive, fast, and helps me stay consistent.",
    imageSrc: avatar3.src,
    name: "Rahul Kumar",
    username: "@rahulkr3200",
  },
  {
    text: "What I love most is how easy it is to share thoughts and get instant feedback from readers. It’s a game-changer for bloggers.",
    imageSrc: avatar4.src,
    name: "Casey Jordan",
    username: "@caseyj",
  },
  {
    text: "Managing my blog used to feel like a chore. Now I actually enjoy the process — from writing to sharing to analyzing performance.",
    imageSrc: avatar5.src,
    name: "Taylor Kim",
    username: "@taylorkimm",
  },
  {
    text: "The customization options are amazing. I’ve made my blog feel truly mine, without needing to write a single line of code.",
    imageSrc: avatar6.src,
    name: "Riley Smith",
    username: "@rileysmith1",
  },
  {
    text: "Publishing a post takes minutes, and everything just works. The layout is clean, mobile-friendly, and perfect for long reads.",
    imageSrc: avatar7.src,
    name: "M S Dhoni",
    username: "@mahi007",
  },
  {
    text: "Collaborating on content with other writers is seamless. Drafts, edits, comments — all beautifully handled within the app.",
    imageSrc: avatar8.src,
    name: "Kurt Cobain",
    username: "@awsmsauce",
  },
  {
    text: "This platform makes it easy to focus on what really matters: writing. Everything else just supports that goal.",
    imageSrc: avatar9.src,
    name: "Julian Casabalancas",
    username: "@casabj",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

type TestimonialsColumnProps = {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
};

const TestimonialsColumn: React.FC<TestimonialsColumnProps> = ({
  className,
  testimonials,
  duration = 10,
}) => (
  <div className={className}>
    <motion.div
      animate={{ translateY: "-50%" }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
      className="flex flex-col gap-6 pb-6"
    >
      {[...new Array(2)].map((_, outerIndex) => (
        <React.Fragment key={outerIndex}>
          {testimonials.map(({ text, imageSrc, name, username }, innerIndex) => (
            <div className="card" key={`${username}-${outerIndex}-${innerIndex}`}>
              <div>{text}</div>
              <div className="flex items-center gap-2 mt-5">
                <Image
                  src={imageSrc}
                  alt={name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex flex-col">
                  <div className="font-medium tracking-tight leading-5">
                    {name}
                  </div>
                  <div className="leading-5 tracking-tight">{username}</div>
                </div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </motion.div>
  </div>
);

export const Testimonials: React.FC = () => {
  return (
    <section className="bg-white py-0">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag">Testimonials</div>
          </div>
          <h2 className="section-title">What our users say</h2>
          <p className="section-description mt-5">
            From intuitive design to powerful features, our app has become an
            essential tool for users around the world.
          </p>
        </div>
        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[738px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};
