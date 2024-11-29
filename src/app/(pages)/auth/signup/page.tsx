import Image from "next/image";
import FormSignUp from "./FormSignUp";
import type { Metadata } from 'next'
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Artia - SignUp',
}

const SignUpPage = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <h1 className="mt-8 text-3xl font-bold">SIGN UP</h1>
            <Link href={'/'} className="mt-4">
                <Image src="/images/artia-logo.png" width={100} height={100} alt="Logo" className="w-[80px]  md:w-[90px] md:h-auto" />
            </Link>
            <FormSignUp />
        </div>
    );
}

export default SignUpPage;
