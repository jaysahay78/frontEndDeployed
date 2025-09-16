'use client';

import { Footer } from "@/sections/Footer";
import Spline from "@splinetool/react-spline";
import { useState } from "react";
import { signUp } from "@/utils/user-service";
import { useToast } from "@/hooks/use-toast"
import { AxiosError } from "axios";
import dynamic from "next/dynamic";

const Navbarlogin = dynamic(() => import("@/components/Navbarlogin"), { ssr: false });


export default function SignupPage() {

    const [data,setData]=useState({
        name:'',
        email:'',
        password:'',
        about:'',
    })


    const [error, setError] = useState<{[key: string]: string } | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setData(prevData => ({
            ...prevData,
            [event.target.id]: event.target.value
        }));
    };

    const resetData=()=>{
        setData({
            name:'',
            email:'',
            password:'',
            about:'',
        })
    }

    const { toast } = useToast()
    
    

    const submitForm= async (event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault()

        try {
            const resp = await signUp(data);
            console.log(resp);
            console.log("success log");
            toast({
                variant:"success",
                description: "User registered successfully",
              });
              setError(null);
              setData({
                name:'',
                email:'',
                password:'',
                about:'',
            })

        } catch (error: any) {
            if (error instanceof AxiosError && error.response) {
                const { name, email, password, about } = error.response.data || {};
        
                console.log("Error response data:", { name, email, password, about });
        
                // Set the error state with destructured values
                setError({ name, email, password, about })
        
            console.log(error)
            console.log("error log")
            console.log(error.response.data.field)
            toast({
                variant:"error",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
              })
            }
        }
    }

    

    return (
        <div className="bg-[linear-gradient(to_bottom,#00021a,#000000)] min-h-screen flex flex-col">
            <Navbarlogin />
            <div className="relative flex items-center justify-center min-h-screen">

                {/* Gradient Sign Up Heading */}
                <h1 className="w-full text-center 
                    sm:absolute sm:top-5 sm:left-1/2 sm:-translate-x-1/2
                    text-5xl sm:text-6xl md:text-7xl lg:text-9xl lg:left-[700px]
                    font-extrabold bg-gradient-to-b from-[#0a0f2c] via-gray-200 to-white 
                    bg-clip-text text-transparent leading-none transition-all 
                    mb-6 sm:mb-0 lg:top-[5px] pb-6">
                        Sign Up
                    </h1>


                {/* Spline Object Positioned to the Left */}
                <div className="hidden lg:block robot absolute left-[5px] top-1/2 transform -translate-y-1/2 w-full max-w-[700px]">
                    <Spline scene="https://prod.spline.design/78FaKy3J8YZqb1BW/scene.splinecode" />
                </div>

                {/* Signup Form Positioned to the Right */}
                <div className="card md:w-1/2 md:ml-auto md:mr-20 bg-white rounded-2xl p-8 md:p-10 
                            shadow-[0_0_40px_rgba(255,255,255,0.4)] max-w-md">
                    
                    <h2 className="text-3xl font-bold text-black mb-6">Create your account</h2>
                    
                    <form className="space-y-6 sm:top-10 sm:mt10" onSubmit={submitForm}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your name"
                                required
                                value={data.name}  // Controlled component
                                onChange={handleChange}
                            />
                            {error?.name && <p className="text-red-500 text-sm mt-1">{error.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="you@example.com"
                                required
                                value={data.email}  // Controlled component
                                onChange={handleChange}
                            />
                            {error?.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Create a password"
                                required
                                value={data.password}  // Controlled component
                                onChange={handleChange}
                            />
                            {error?.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
                        </div>

                        <div>
                            <label htmlFor="About" className="block text-sm font-medium text-gray-700 mb-1">
                                About
                            </label>
                            <input
                                id="about"
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter about yourself"
                                required
                                value={data.about}  // Controlled component
                                onChange={handleChange}
                            />
                            {error?.about && <p className="text-red-500 text-sm mt-1">{error.about}</p>}
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <button
                                onClick={resetData}
                                type="reset"
                                className="w-[150px] bg-black text-white py-3 rounded-full font-medium transition-all ease-in-out duration-700 hover:bg-gray-900 hover:scale-105"
                            >
                                Reset
                            </button>

                            <button
                                type="submit"
                                className="w-[150px] bg-black text-white py-3 rounded-full font-medium transition-all ease-in-out duration-700 hover:bg-gray-900 hover:scale-105">
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}
