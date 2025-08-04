"use client"

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      {/* Top Notification Bar */}
      <div className="bg-gray-900 dark:bg-gray-950 text-white text-center py-2 px-4">
        <p className="text-sm">
          <span className="font-medium">Beta</span> - Trade effort for impact with ProofFlow's AI analyst
        </p>
      </div>

      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                ProofFlow
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
                Customers
              </Link>
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
                Changelog
              </Link>
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
                About
              </Link>
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
                Careers
              </Link>
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
                Docs
              </Link>
              <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
                Login
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white font-medium">
                  Book a demo
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-3">
              <Link href="/signup">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                  Get Started
                </Button>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!mobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Customers
              </Link>
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Changelog
              </Link>
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Careers
              </Link>
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Docs
              </Link>
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="relative">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/40 dark:via-gray-900/20 dark:to-gray-900/40"></div>

        <div className="relative px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 sm:mb-8">
              <span className="inline-flex items-center rounded-full bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-orange-700 dark:text-orange-300 ring-1 ring-inset ring-orange-600/20 dark:ring-orange-400/20">
                <span className="hidden sm:inline">FP&amp;A FOR HIGH GROWTH TEAMS</span>
                <span className="sm:hidden">FOR GROWING BUSINESSES</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 sm:mb-8">
              <span className="block sm:inline">Simulate any business</span>
              <br />
              <span className="block sm:inline">decision in seconds</span>
            </h1>

            {/* Subheading */}
            <p className="mx-auto max-w-2xl text-base sm:text-lg lg:text-xl leading-6 sm:leading-8 text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 px-4 sm:px-0">
              Bring your data to life through real-time collaborative planning, reporting, and forecasting to drive better decisions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4 sm:px-0">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium">
                  Book a demo
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <span className="mr-2">▶</span>
                See it in action
              </Button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10 overflow-hidden">
                <Image
                  src="/home/dashboard.webp"
                  alt="ProofFlow Dashboard Preview"
                  width={1400}
                  height={900}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 sm:mt-24 text-center">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-6 sm:mb-8">
              Trusted by high-growth teams worldwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-12 opacity-60">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-400 dark:text-gray-500">myfitnesspal</div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-400 dark:text-gray-500">AngelList</div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-400 dark:text-gray-500">Lambda</div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-400 dark:text-gray-500">Kit</div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-400 dark:text-gray-500">Sprig</div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-400 dark:text-gray-500">KICK</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}