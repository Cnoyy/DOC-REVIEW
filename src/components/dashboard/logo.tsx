import Link from "next/link";

export function DocReviewLogo() {
  return (
    <Link href="/dashboard/upload" className="flex items-center text-lg font-bold tracking-tight text-white cursor-pointer">
      <img
        src="../images/browser-icon.png"
        alt=""
        className="w-5 h-5 mr-1"
      />
      DocuReview
    </Link>
  );
}
