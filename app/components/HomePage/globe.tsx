import { Globe } from "@/components/magicui/globe";

export function GlobeDemo() {
  return (
    <div className="relative flex w-full h-[600px] items-center justify-between overflow-hidden rounded-lg border bg-background p-20 bg-gray-800">
      {/* Left Side Text */}
      <div className="max-w-lg text-left">
        <h1 className="text-5xl font-bold text-black-900">
          Used by Many People
        </h1>
        <p className="mt-6 text-xl text-white">
          This is a finance management application that helps users track expenses, manage income, and optimize their financial goals.
        </p>
      </div>
      
      {/* Right Side Globe */}
      <div className="flex justify-end w-full pr-20">
        <Globe className="w-[550px] h-[550px]" />
      </div>
    </div>
  );
}