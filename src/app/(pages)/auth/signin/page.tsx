import Image from "next/image"
import Link from "next/link"
import FormSignIn from "./FormSignIn"

const SignInPage = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <h1 className="mt-8 text-3xl font-bold">SIGN IN</h1>
            <Link href={'/'} className="mt-4">
                <Image src="/images/artia-logo.png" width={100} height={100} alt="Logo" className="w-[80px]  md:w-[90px] md:h-auto" />
            </Link>
            <FormSignIn />
        </div>
    )
}

export default SignInPage