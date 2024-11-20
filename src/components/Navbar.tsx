"use client";
import { useState } from 'react';
import { Menubar, MenubarMenu } from "@/components/ui/menubar";
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <Menubar className="py-8 px-6 md:px-16 flex justify-between items-center shadow-sm bg-white z-[999]">
            <div className="flex items-center">
                <Image src="/images/artia-logo.png" width={100} height={100} alt="Logo" className="w-[80px]  md:w-[90px] md:h-auto" />
            </div>

            {/* Menu untuk desktop */}
            <div className="hidden md:flex md:space-x-6 lg:space-x-12">
                <MenubarMenu>
                    <Link href={`/`} className="text-slate-950 text-opacity-65 hover:text-opacity-100">Home</Link>
                </MenubarMenu>
                <MenubarMenu>
                    <Link href={`/articles`} className="text-slate-950 text-opacity-65 hover:text-opacity-100">Articles</Link>
                </MenubarMenu>
                <MenubarMenu>
                    <Link href={`/about`} className="text-slate-950 text-opacity-65 hover:text-opacity-100">About</Link>
                </MenubarMenu>
            </div>

            {/* Hamburger menu for mobile */}
            <div className="md:hidden flex items-center">
                <button
                    onClick={toggleMobileMenu}
                    className="text-slate-950 transition-all duration-300 ease-in-out transform"
                >
                    {/* Hamburger or Close Icon based on mobile menu state */}
                    {isMobileMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-90 transition-all duration-300">
                            <path d="M6 18L18 6M6 6L18 18" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300">
                            <path d="M3 12h18M3 6h18M3 18h18" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 -left-1 w-full flex flex-col px-6 shadow-sm py-6 space-y-4">
                    <MenubarMenu>
                        <Link href={`/`} className="text-slate-950 text-opacity-65 hover:text-opacity-100">Home</Link>
                    </MenubarMenu>
                    <MenubarMenu>
                        <Link href={`/articles`} className="text-slate-950 text-opacity-65 hover:text-opacity-100">Articles</Link>
                    </MenubarMenu>
                    <MenubarMenu>
                        <Link href={`/about`} className="text-slate-950 text-opacity-65 hover:text-opacity-100">About</Link>
                    </MenubarMenu>
                </div>
            )}
        </Menubar>
    );
}

export default Navbar;
