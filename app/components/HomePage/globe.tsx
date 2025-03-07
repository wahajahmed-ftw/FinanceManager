import { Globe } from "@/components/magicui/globe";
import { TextAnimate } from "@/components/magicui/text-animate";

export function GlobeDemo() {
  return (
    <div
      className="relative flex w-full h-[600px] items-center justify-center overflow-hidden rounded-lg p-20"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Left Side Text */}
      <div className="max-w-lg text-left absolute left-10">
        <h1 className="text-5xl font-bold" style={{ color: "var(--primary)" }}>
          Used by Many People
        </h1>
        <p className="mt-6 text-xl z-30" style={{ color: "var(--muted-foreground)" }}>
          <TextAnimate animation="blurInUp" by="character" once>
            This finance management app helps users track expenses, manage income, and optimize their financial goals.
          </TextAnimate>
        </p>
      </div>

      {/* 🌍 Globe Centered */}
      <div className="absolute top-10 inset-0 flex items-center justify-center">
        <Globe className="w-[550px] h-[550px]" />
      </div>

      {/* Right Side Text */}
      <div className="max-w-lg text-right absolute right-10">
        <h1 className="text-5xl font-bold" style={{ color: "var(--primary)" }}>
          Secure & Reliable
        </h1>
        <p className="mt-6 text-xl" style={{ color: "var(--muted-foreground)" }}>
          <TextAnimate animation="blurInUp" by="character" once>
            Stay ahead with real-time financial insights and seamless money management at your fingertips.
          </TextAnimate>
        </p>
      </div>
    </div>
  );
}
