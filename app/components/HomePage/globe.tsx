import { Globe } from "@/components/magicui/globe";
import { TextAnimate } from "@/components/magicui/text-animate";

export function GlobeDemo() {
  return (
    <div
      className="relative flex flex-col w-full h-auto lg:h-[600px] items-center justify-center overflow-hidden rounded-lg p-10 lg:p-20"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Text Wrapper: Changes Position Based on Screen Size */}
      <div className="flex flex-col max-[1300px]:gap-10 lg:flex-row items-center w-full">
        
        {/* Left Side Text (or Top on Screens ≤ 1300px) */}
        <div className="max-w-lg text-center lg:text-left lg:flex-1 z-10">
          <h1
            className="text-3xl lg:text-5xl font-bold"
            style={{ color: "var(--primary)" }}
          >
            Used by Many People
          </h1>
          <p className="mt-4 lg:mt-6 text-lg lg:text-xl" style={{ color: "var(--muted-foreground)" }}>
            <TextAnimate animation="blurInUp" by="character" once>
              This finance management app helps users track expenses, manage income, and optimize their financial goals.
            </TextAnimate>
          </p>
        </div>

        {/* 🌍 Globe (Hides on Screens ≤ 1300px) */}
        <div className="max-[1020px]:hidden flex items-center justify-center w-full lg:w-auto">
          <Globe className="w-[300px] h-[300px] lg:w-[550px] lg:h-[550px]" />
        </div>

        {/* Right Side Text (or Bottom on Screens ≤ 1300px) */}
        <div className="max-w-lg text-center lg:text-right lg:flex-1 z-10">
          <h1
            className="text-3xl lg:text-5xl font-bold"
            style={{ color: "var(--primary)" }}
          >
            Secure & Reliable
          </h1>
          <p className="mt-4 lg:mt-6 text-lg lg:text-xl" style={{ color: "var(--muted-foreground)" }}>
            <TextAnimate animation="blurInUp" by="character" once>
              Stay ahead with real-time financial insights and seamless money management at your fingertips.
            </TextAnimate>
          </p>
        </div>

      </div>
    </div>
  );
}
