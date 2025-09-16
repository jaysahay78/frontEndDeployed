"use client";

import { Footer } from '@/sections/Footer';
import Spline from '@splinetool/react-spline';
import dynamic from 'next/dynamic';
import { isLoggedIn } from '../(auth)';
import { useState } from 'react';
import Bot from '@/components/ChatBot';

const NavbarAbout = dynamic(() => import("@/components/Navbarabout"), { ssr: false });
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });

export default function Home() {
  const [showChatbot, setShowChatbot] = useState(false);

    const loggedIn = isLoggedIn(); // true or false based on token

  return (
    <>
    <div className="relative min-h-screen overflow-x-clip">
    {loggedIn ? <NavbarAbout /> : <Navbar />}
      {/* Full‑cover Spline background */}
      <Spline
        scene="https://prod.spline.design/3BGbxkCMYmMOL1yM/scene.splinecode"
        className="absolute inset-0 -z-10 pointer-events-none"
      />

      {/* Left‑aligned translucent card */}
      <section className="relative z-10 flex items-start justify-start min-h-screen px-4 py-16">
        <div className="w-full max-w-3xl bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-left">
            Need Help? We&apos;ve Got You.
          </h1>
          <p className="text-lg leading-relaxed mb-10 text-left">
            Welcome to the BlogBot help center. Whether you&apos;re new or just need a refresher, here&apos;s everything you need to know to make your blogging journey smooth and enjoyable.
          </p>
          <div className="text-left space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Getting Started</h2>
              <p>
                Create an account by clicking on the “Sign Up” button located in the top-right corner.
                <br />
                 Already registered? click on login button on signup page to sign in.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Creating a Post</h2>
              <p>
                Go to the "my profile" section by clicking on the user icon or go to home page and click “New Post”. Fill in the title, content, categories, and add images if needed.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Managing Your Profile</h2>
              <p>
                go to you profile and click on <span className="font-medium">editprofile</span> to update your profile details or change your password.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Payments</h2>
              <p>
                In the user drop down menu click on <span className="font-medium">pricing</span> to manage billing options or view payment history.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Need More Support?</h2>
              <p>
                Reach out to us at <span className="font-medium">jaysahay78@gmail.com</span> or call <span className="font-medium">+91 xxxxxx xxxx</span>. We&apos;re here to help!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Bot showChatbot={showChatbot} setShowChatbot={setShowChatbot} />
    <Footer />
    </>
  );
}
