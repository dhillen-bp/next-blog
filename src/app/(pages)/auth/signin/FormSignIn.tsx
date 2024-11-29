"use client"

import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const FormSignIn = () => {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const signIn = async () => {
        try {
            const response = await fetch("/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const { message } = await response.json();
                toast.error(`Error: ${message}`);
                return router.refresh();
            }

            toast.success("Sign In successfully!");
            router.push("/")
        } catch (error) {
            toast.error("Failed to register user.");
            console.log(error);

        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        signIn();
    };

    return (
        <form className="bg-white my-8 p-8 rounded-xl shadow-md w-full md:w-1/2" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3 mb-8">
                <label htmlFor="email" className="font-semibold">Email</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Your Email..."
                    className="block w-full px-4 py-2 text-sm font-normal rounded-full shadow-xs text-gray-900 bg-transparent border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-3 mb-8">
                <label htmlFor="password" className="font-semibold">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Your Password..."
                        className="block w-full px-4 py-2 text-sm font-normal rounded-full shadow-xs text-gray-900 bg-transparent border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-4 flex items-center text-gray-600 hover:text-gray-800"
                    >
                        {showPassword ? "🙈" : "🐵"}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
                Sign In
            </button>

            <span className="mt-4 block">Don&apos;t have an account? <Link href="/auth/signup" className="hover:font-semibold">Sign Up Here!</Link></span>
        </form>
    )
}

export default FormSignIn