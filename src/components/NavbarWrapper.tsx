"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const NavbarWrapper = () => {
    const pathname = usePathname();

    const hideNavbarPaths = ["/auth/signin", "/auth/signup"];
    const showNavbar = !hideNavbarPaths.includes(pathname);

    return showNavbar ? <Navbar /> : null;
}

export default NavbarWrapper