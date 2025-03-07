import { Separator } from "@radix-ui/react-separator";
import Footer from "./footer";
import { GlobeDemo } from "./globe";
import MarqueeDemo from "./reviews";
import LandingSection from "./manageFiance";
import { MainLanding } from "./mainLanding";
import { div } from "motion/react-client";

export default function LandingPage() {
  return (
    <div>
      <MainLanding />
      <Separator />
      <LandingSection />
      <Separator />
      <MarqueeDemo />
      <Separator />
      <GlobeDemo />
      <Separator />
      <Footer />
    </div>
  );
}
