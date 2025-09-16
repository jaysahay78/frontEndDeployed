"use client"

import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useCallback, useRef, useState } from "react";
import { twMerge } from 'tailwind-merge';
import { useRouter } from "next/navigation";

type Props = {
    priceId: string | null;
  };

export default function EmbeddedCheckoutButton({ priceId }: Props) {
    const router = useRouter();
    const stripePromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
    );
    const [showCheckout, setShowCheckout] = useState(false);
    const modalRef = useRef<HTMLDialogElement>(null);

    const fetchClientSecret = useCallback(() => {
    if (!priceId) return Promise.reject("No price ID");

        return fetch("/api/embedded-checkout", { 
            method: "POST", 
            headers: { 
            "Content-Type": "application/json", 
            }, 
            body: JSON.stringify({ priceId }), 
            }) 
            .then((res) => res.json()) 
            .then((data) => data.client_secret); 
    },[priceId]);

    const options = { fetchClientSecret }


    const handleCheckoutClick = () => {
        if (!priceId) {
            // If priceId is null, redirect to "user/home"
            router.push("/user/home");
            return;
          }

        setShowCheckout(true);
        modalRef.current?.showModal();
    };

    const handleCloseModal = () => {
        setShowCheckout(false);
        modalRef.current?.close();
    };
    return(
        <div id="checkout">
            <button onClick={handleCheckoutClick}  className={twMerge(
                "btn mt-4 w-full py-2 rounded-lg font-semibold transition-all duration-30 bg-white text-black hover:bg-black hover:text-white"
                )}>{priceId ? "Pay Now" : "Get Started"}</button>
            <dialog ref={modalRef}
            className="w-full max-w-4xl rounded-xl border shadow-xl backdrop:bg-black/30">
            <div>
                <form method="dialog">
                    <button onClick={handleCloseModal} 
                    className="text-gray-500 hover:text-black text-xl hover:bg-orange-500 hover:rounded-lg hover:p-1 absolute top-4 right-4 transition-all duration-300">
                    ✕
                    </button>
                </form>
            </div>
                <div className="p-6">
                {showCheckout && priceId && (
                  <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                )}
                </div>
                
            </dialog>
    </div>
    )
}