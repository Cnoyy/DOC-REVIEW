import Link from "next/link";
import { typography as t } from "@/lib/theme";

interface DocReviewLogoProps {
  destination?: string;
  textColor?: string;
  className?: string;
}

export function DocReviewLogo({ destination = "/dashboard/upload", textColor = "text-white", className = "" }: DocReviewLogoProps) {
 return (
 <Link href={destination} className={`flex items-center text-lg font-bold tracking-tight ${textColor} cursor-pointer ${className}`}>
 <img src="../images/browser-icon.png" alt="" className="w-5 h-5 mr-1.5 shrink-0" />
 DocuReview
 </Link>
 );
}