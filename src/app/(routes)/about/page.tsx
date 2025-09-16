'use client';

import { Footer } from "@/sections/Footer";
import dynamic from "next/dynamic";
import { isLoggedIn } from "@/app/(auth)/index" 
import Spline from "@splinetool/react-spline";
const Navbarabout = dynamic(() => import("@/components/Navbarabout"), { ssr: false });
const NavbarLogin = dynamic(() => import("@/components/Navbarlogin"), { ssr: false });


export default function AboutPage() {
  const loggedIn = isLoggedIn();

  return (
    <div className="min-h-screen bg-black">
      {loggedIn ? <Navbarabout /> : <NavbarLogin />}
      <div className="container mx-auto px-4 mt-10 md:mt-10 flex flex-col md:flex-row">
        {/* Left Column */}
        <div className="md:w-1/2 md:pr-12 mb-12 md:mb-0">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent text-grad mb-8">
            About Our <br /> Journey
          </h1>
          <div className="prose prose-lg text-white max-w-none">
          <p className="mb-6">
            Launched in 2023, our BlogApp was created with one clear goal: to provide a seamless, intuitive platform for sharing ideas and building communities. What began as a small project has quickly grown into a widely-used tool that empowers writers, bloggers, and content creators worldwide.
          </p>
          <p className="mb-6">
            Our key innovation is the easy-to-use post editor and real-time collaboration features, designed to help users effortlessly create and share content. With a focus on accessibility and user experience, we've made it simpler than ever for anyone to start blogging and connect with an engaged audience.
          </p>
          <p>
            Today, BlogApp serves thousands of users across the globe, helping them bring their voices to life. Our team, committed to continuous improvement, is dedicated to providing new features and tools that enhance the creative process and foster meaningful connections within the blogosphere.
          </p>

          </div>
          <div className="mt-8 flex items-center space-x-6">
            <button className="bg-slate-200 text-black px-6 py-3 rounded-full font-medium hover:bg-slate-300 hover:scale-110 transition-all ease-in-out">
              Meet Our Team
            </button>
            <button className="flex items-center text-white font-medium hover:text-slate-300 hover:scale-110 transition-all ease-in-out">
              Join Us <span className="ml-2">→</span>
            </button>
          </div>
        </div>

        <div className="md:w-2/3 flex justify-center items-center relative">
          <div className="w-full h-[900px]">
          <Spline scene="https://prod.spline.design/ljjrZG1iTxl9me3R/scene.splinecode" />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <div className="text-4xl font-bold bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent text-grad mb-2">2M+</div>
            <div className="text-white">Active Users</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <div className="text-4xl font-bold bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent text-grad mb-2">42</div>
            <div className="text-white">Countries Served</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <div className="text-4xl font-bold bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent text-grad mb-2">98%</div>
            <div className="text-white">Customer Satisfaction</div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
