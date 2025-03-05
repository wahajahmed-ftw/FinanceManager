import { div } from "motion/react-client";
import Image from "next/image";
import { GlobeDemo } from "./components/HomePage/globe";
export default function Home() {
  return (
    <div>
        Hello This is home page
        <GlobeDemo />  
    </div>
  );
}

