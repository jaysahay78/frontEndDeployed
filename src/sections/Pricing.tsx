'use client';

import CheckIcon from "@/assets/check.svg";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/app/(auth)";

export const pricingTiers = [
  {
    title: "Free",
    monthlyPrice: 0,
    buttonText: "Sign up now",
    popular: false,
    inverse: false,
    features: [
      "100 blog posts",
      "Unlimited posts",
      "Basic analytics",
      "Community support",
    ],
  },
  {
    title: "Pro",
    monthlyPrice: 500,
    buttonText: "Sign up now",
    popular: true,
    inverse: true,
    features: [
      "Up to 500 blog posts",
      "50 AI '/write' uses per day",
      "Developer API access",
      "Custom themes",
      "Priority support",
    ],
  },
  {
    title: "Business",
    monthlyPrice: 2000,
    buttonText: "Sign up now",
    popular: false,
    inverse: false,
    features: [
      "Unlimited blog posts",
      "100 AI '/write' uses per day",
      "Advanced analytics",
      "White-label branding",
      "Dedicated account manager",
    ],
  }
];

export const Pricing = () => {
  const router = useRouter();

  const handleClick = () => {
    if (isLoggedIn()) {
      router.push("/user/payment");
    } else {
      router.push("/signup");
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title">Pricing</h2>
          <p className="section-description mt-5">
            Free forever, upgrade for unlimited posts in a day, access to more AI features.
          </p>
        </div>

        <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-end lg:justify-center">
          {pricingTiers.map(({ title, monthlyPrice, buttonText, popular, inverse, features }, index) => (
            <div
              key={title}
              className={twMerge(
                "card transition-all duration-700 hover:scale-110",
                inverse === true && "border-black bg-black text-white"
              )}
            >
              <div className="flex justify-between">
                <h3
                  className={twMerge(
                    "text-lg font-bold text-black/50",
                    inverse === true && "text-white/60"
                  )}
                >
                  {title}
                </h3>

                {popular === true && (
                  <div
                    key={`${title}-popular`}
                    className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20"
                  >
                    <motion.span
                      animate={{ backgroundPositionX: "100%" }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop",
                      }}
                      className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF)] [background-size:200%] text-transparent bg-clip-text font-medium"
                    >
                      Popular
                    </motion.span>
                  </div>
                )}
              </div>

              <div className="flex items-baseline gap-1 mt-[30px]">
                <span className="text-4xl font-bold tracking-tighter leading-none">₹{monthlyPrice}</span>
                <span className="tracking-tight font-bold text-black/50">/month</span>
              </div>

              <button
                onClick={handleClick}
                className={twMerge(
                  "btn btn-primary w-full mt-[30px]",
                  inverse === true && "bg-white text-black"
                )}
              >
                {buttonText}
              </button>

              <ul className="flex flex-col gap-5 mt-8">
                {features.map((feature, i) => (
                  <li key={`${title}-${i}`} className="text-sm flex items-center gap-4">
                    <CheckIcon className="h-6 w-6" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
