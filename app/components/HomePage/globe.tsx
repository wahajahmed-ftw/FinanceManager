import { Globe } from "@/components/magicui/globe";
import { TextAnimate } from "@/components/magicui/text-animate";

export function GlobeDemo() {
  return (
    <div
      className="relative flex flex-col w-full h-auto lg:h-[600px] items-center justify-center overflow-hidden rounded-lg p-10 lg:p-20"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Headings Row - Always on same line */}
      <div className="flex flex-row w-full max-w-[1600px] justify-between mb-8">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-3xl lg:text-5xl font-bold" style={{ color: "var(--primary)" }}>
            Widely Used
          </h1>
        </div>
        
        <div className="flex-1 hidden lg:block"></div> {/* Spacer for desktop */}
        
        <div className="flex-1 text-center lg:text-right">
          <h1 className="text-3xl lg:text-5xl font-bold" style={{ color: "var(--primary)" }}>
            Secure & Reliable
          </h1>
        </div>
      </div>

      {/* Content Row */}
      <div className="flex flex-col lg:flex-row items-center w-full max-w-[1600px] justify-between">
        {/* Left Side Content */}
        <div className="max-w-lg text-center lg:text-left flex-1 z-10 mb-8 lg:mb-0">
          <p className="text-lg lg:text-xl" style={{ color: "var(--muted-foreground)" }}>
            <TextAnimate animation="blurInUp" by="character" once>
              This finance management app helps users track expenses, manage income, and optimize their financial goals.
            </TextAnimate>
          </p>
        </div>

        {/* Globe in the Center */}
        <div className="hidden lg:flex flex-1 justify-center">
          <Globe className="w-[300px] h-[300px] lg:w-[550px] lg:h-[550px]" />
        </div>

        {/* Right Side Content */}
        <div className="max-w-lg text-center lg:text-right flex-1 z-10">
          <p className="text-lg lg:text-xl" style={{ color: "var(--muted-foreground)" }}>
            <TextAnimate animation="blurInUp" by="character" once>
              Stay ahead with real-time financial insights and seamless money management at your fingertips.
            </TextAnimate>
          </p>
        </div>
      </div>
    </div>
  );
}