import ArrowRight from "@/assets/arrow-right.svg";
import dynamic from "next/dynamic";
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: true });


export const Header = () => {
  return (
  <header className="sticky top-0 backdrop-blur-sm z-20">
      <div className="w-full flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
        <p className='text-white/60 hidden md:block'>
          Get ready to share the world with you</p>
        <div className='inline-flex gap-1 items-center'>
        <p>Join right now for free</p>
        <ArrowRight className="h-4 w-4 inline-flex justify-center items-center" />
        </div>
      </div>
      <Navbar />
    </header>
  );
};
