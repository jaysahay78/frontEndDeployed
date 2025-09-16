import { stripe } from "@/utils/stripe";

async function getSession(sessionId: string) {
    const session = await stripe.checkout.sessions.retrieve(sessionId!);
    return session;
}

export default async function CheckoutReturn({ searchParams }: { searchParams: { session_id: string } }) {
    if (!searchParams.session_id) {
        const sessionId = searchParams.session_id;
        const session = await getSession(sessionId);


        if (session?.status === "open"){
            return <p>Payment did not work</p>;
        }

        if (session?.status === "complete"){
            return (<p>Payment was successful.
                Your customer Id is: {(session.customer as string)}
            </p>
            );
        }
    }
}
    