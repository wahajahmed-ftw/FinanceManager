import { div } from "motion/react-client";
import Image from "next/image";
import { GlobeDemo } from "./components/HomePage/globe";
import MarqueeDemo from "./components/HomePage/reviews";
export default function Home() {
  return (
    <div>
    <div className="relative flex w-full flex-col items-center justify-center py-10 overflow-hidden">
        Hello This is home page
        <GlobeDemo />
        <MarqueeDemo />
    </div>
    </div>
  );
}

