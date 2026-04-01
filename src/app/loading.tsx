import { BrandLogo } from "@/components/site/brand-logo";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b0b] px-6">
      <BrandLogo
        priority
        width={240}
        height={78}
        className="animate-fade-in motion-reduce:animate-none"
      />
      </div>
  );
}
