'use client';

import { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import CheckIcon from '@/assets/check.svg';
import { pricingTiers } from '@/sections/Pricing'; // Adjust if path differs
import EmbeddedCheckoutButton from '@/components/EmbeddedCheckoutButton';
import { useRouter } from 'next/navigation';
import { Footer } from '@/sections/Footer';
import dynamic from 'next/dynamic';
import Spline from '@splinetool/react-spline';

const RedirectToHome = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/feed"); // Redirect to the home page
  }, [router]);

  return null;
};

// Example price IDs (real ones from Stripe dashboard)
const PRICE_IDS: Record<string, string> = {
  Free: "null",
  Pro: "price_1REYHbQdP4wihkDybjX5I9jT",
  Business: "price_1REYIAQdP4wihkDyona8AFuf",
};

const NavbarAuth = dynamic(() => import("@/components/Navbarauth"), { ssr: false });

const PaymentPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(pricingTiers[1]); // Default to "Pro"

  return (
    <div className="relative min-h-screen overflow-hidden">
      <NavbarAuth />
      <Spline
        scene="https://prod.spline.design/U6D1NLUq00tHNieK/scene.splinecode"
        className="absolute inset-0 -z-10 pointer-events-none"
      />
    <section className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Upgrade Your Plan</h1>
          <p className="text-gray-600 mt-4">Choose the plan that fits your writing journey and unlock premium features.</p>
        </div>

        {/* Plan Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {pricingTiers.map((plan) => (
            <div
              key={plan.title}
              onClick={() => setSelectedPlan(plan)}
              className={twMerge(
                "cursor-pointer rounded-xl border p-6 hover:shadow-md transition-all duration-300",
                selectedPlan.title === plan.title ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white',
                plan.inverse && 'bg-black text-white'
              )}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{plan.title}</h2>
                {plan.popular && (
                  <span className="text-xs px-3 py-1 bg-gradient-to-r from-purple-400 to-blue-400 text-white rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <p className="mt-4 text-3xl font-bold">₹{plan.monthlyPrice}<span className="text-base font-normal">/month</span></p>
              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckIcon className="h-5 w-5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div>
                  <EmbeddedCheckoutButton priceId={plan.title === "Free" ? null : PRICE_IDS[plan.title]} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <Footer />
    </div>
  );
};

export default PaymentPage;
