import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";
import { getCurrentUserDetail } from "@/app/(auth)";

export async function POST(request: Request) {
    try{
        const { priceId } = await request.json();

        if (!priceId) {
            return NextResponse.json({ error: "No payment required for Free plan." }, { status: 400 });
          }

        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                    adjustable_quantity: {
                        enabled: false, // or true if user can change quantity
                    },
                },
            ],
            customer_email: getCurrentUserDetail().email,
            metadata:{
                userId: getCurrentUserDetail().id,
            },
            mode: 'subscription',
            return_url: `${request.headers.get('origin')}/return?session_id={CHECKOUT_SESSION_ID}`,
        });
        return NextResponse.json({id: session.id, client_secret: session.client_secret}, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}