"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1a1a] flex flex-col font-sans">
      <nav className="flex items-center justify-between px-[6%] py-5 border-b border-[#e8e4df] relative bg-[#faf9f7] z-50">
        <Link href="/" className="flex items-center text-lg font-bold tracking-tight text-[#1a1a1a] cursor-pointer">
          <img
            src="../images/browser-icon.png"
            alt=""
            className="w-5 h-5 mr-1"
          />
          DocuReview<span className="text-[#c96442]">.</span>
        </Link>

        <div className="max-md:hidden flex items-center gap-3">
          <Button
            variant="mycancel"
            className="px-5 py-2 rounded-full font-semibold text-sm"
            asChild
          >
            <Link href="/Auth/Login">Sign In</Link>
          </Button>
          <Button
            variant="mybutton"
            className="px-5 py-2 rounded-full font-semibold text-sm"
            asChild
          >
            <Link href="/Auth/Register">Sign Up</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-2 text-[#1a1a1a]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#faf9f7] border-b border-[#e8e4df] p-6 flex flex-col gap-4 md:hidden shadow-xl animate-in slide-in-from-top-5">
            <Button
              variant="mycancel"
              className="w-full py-6 rounded-xl font-semibold text-base"
              asChild
            >
              <Link href="/Auth/Login">Sign In</Link>
            </Button>
            <Button
              variant="mybutton"
              className="w-full py-6 rounded-xl font-semibold text-base"
              asChild
            >
              <Link href="/Auth/Register">Sign Up</Link>
            </Button>
          </div>
        )}
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-[6%] py-12 md:py-16">
        <h1 className="text-[clamp(1.8rem,8vw,3.4rem)] font-extrabold leading-[1.15] tracking-tight text-[#111] max-w-[90vw] md:whitespace-nowrap">
          Review Your <br className="block md:hidden" /> Documents
        </h1>
        <p className="text-[#666] text-sm md:text-base max-w-[460px] mx-auto mt-5 mb-9 leading-relaxed">
          DocuReview brings AI analysis, reviewer collaboration, and document
          management into one clean, secure platform.
        </p>
        <div className="flex gap-3 w-full md:w-auto justify-center">
          <Button
            variant="mybutton"
            className="w-[80%] md:w-auto px-15 py-6 rounded-full shadow-lg font-bold text-[0.95rem]"
            asChild
          >
            <Link href="/Auth/Login">Get Started</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-[#e8e4df] py-6 px-[6%] flex items-center justify-center md:justify-end flex-wrap gap-4">
        <p className="text-[0.78rem] text-[#aaa]">
          © 2026 DocuReview. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
