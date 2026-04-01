import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

export function BrandLogo({
  className,
  priority = false,
  width = 220,
  height = 72,
}: BrandLogoProps) {
  return (
    <Image
      src="/lemofest/dugem-logos.png"
      alt="Lemo Fest"
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}
