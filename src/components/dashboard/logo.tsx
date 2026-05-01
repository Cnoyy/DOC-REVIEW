import Link from "next/link";
import { typography as t } from "@/lib/theme";

interface DocReviewLogoProps {
  destination?: string;
  textColor?: string;
  className?: string;
  showText?: boolean;
}

export function DocReviewLogo({ destination = "/dashboard/upload", textColor = "text-white", className = "", showText = true }: DocReviewLogoProps) {
 return (
 <Link href={destination} className={`flex items-center text-lg font-bold tracking-tight ${textColor} cursor-pointer ${className}`}>
 <img src="/images/browser-icon.png" alt="DocuReview Logo" className="w-5 h-5 mr-1.5 shrink-0" style={{ imageRendering: 'crisp-edges' }} />
 {showText && "DocuReview"}
 </Link>
 );
}