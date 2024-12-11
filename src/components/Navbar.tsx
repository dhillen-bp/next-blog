"use client";;
import { useState } from 'react';
import { Menubar, MenubarMenu } from "@/components/ui/menubar";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from "next/navigation";

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const menuItems = [
        { href: "/", label: "Home" },
        { href: "/articles", label: "Articles" },
        { href: "/about", label: "About" },
    ];

    const { user, setUser } = useAuth();

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const [isOpen, setIsOpen] = useState(false); // Menyimpan status dropdown
    // Toggle fungsi untuk membuka/menutup dropdown
    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSignOut = async () => {
        const response = await fetch("/api/auth/signout", {
            method: "POST",
        });

        if (!response.ok) {
            toast.error("Failed to sign out");
            return;
        }
        setUser(null); // Bersihkan state user
        toast.success("Signed out successfully!");
        router.push("/auth/signin"); // Redirect ke halaman sign-in

    };

    // console.log("navbar user: ", user);

    return (
        <Menubar className="py-8 px-6 md:px-16 flex justify-between items-center shadow-sm bg-white z-[999]">
            <div className="flex items-center">
                <Image src="/images/artia-logo.png" width={100} height={100} alt="Logo" className="w-[80px]  md:w-[90px] md:h-auto" priority={true} />
            </div>

            {/* Menu untuk desktop */}
            <div className="hidden md:flex items-center md:space-x-6 lg:space-x-12">
                {menuItems.map((item) => (
                    <MenubarMenu key={item.href}>
                        <Link
                            href={item.href}
                            className={`text-slate-950 text-opacity-65 hover:text-opacity-100 ${pathname === item.href ? "text-opacity-100" : ""
                                }`}
                        >
                            {item.label}
                        </Link>
                    </MenubarMenu>
                ))}

                {user && user?.email != undefined ?
                    <div className="relative">
                        <Link
                            href="#"
                            className="flex items-center space-x-2 bg-blue-300 py-1.5 px-3 rounded-full"
                            onClick={toggleDropdown} // Toggle dropdown ketika diklik
                        >
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd" />
                            </svg>
                            <span className='text-sm'>{user.name}</span>
                        </Link>

                        {/* Dropdown Menu */}
                        {isOpen && (
                            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-xl w-48 border overflow-hidden z-10">
                                <div className="overflow-hidden">
                                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">
                                        Profile
                                    </Link>
                                    <Link href="/my-dashboard" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">
                                        My Dashboard
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    :
                    <Link
                        href="/auth/signin"
                        className="relative flex justify-center items-center px-3 py-1 text-sm rounded-xl border border-blue-500 text-blue-500 overflow-hidden group"
                    >
                        <span className="absolute inset-0 bg-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
                        <span className="relative z-10 group-hover:text-white">Sign In</span>
                    </Link>
                }

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
                <div className="md:hidden absolute top-16 -left-1 w-full flex flex-col px-6 shadow-sm py-6 space-y-4 z-10 bg-white">
                    {user && user?.email != undefined ?
                        <div className="relative">
                            <Link
                                href="#"
                                className="flex items-center space-x-2 bg-blue-300 py-1.5 px-3 rounded-full"
                                onClick={toggleDropdown} // Toggle dropdown ketika diklik
                            >
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd" />
                                </svg>
                                <span className='text-sm'>{user.name}</span>
                            </Link>

                            {/* Dropdown Menu */}
                            {isOpen && (
                                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-xl w-48 border overflow-hidden z-10">
                                    <div className="overflow-hidden">
                                        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">
                                            Profile
                                        </Link>
                                        <Link href="/my-dashboard" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">
                                            My Dashboard
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        :
                        <Link
                            href="/auth/signin"
                            className="relative flex justify-center items-center px-3 py-1 text-sm rounded-xl border border-blue-500 text-blue-500 overflow-hidden group"
                        >
                            <span className="absolute inset-0 bg-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
                            <span className="relative z-10 group-hover:text-white">Sign In</span>
                        </Link>
                    }

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
