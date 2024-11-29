"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const FormSignUp = () => {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const createUser = async () => {
        if (!passwordMatch) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const { message } = await response.json();
                toast.error(`Error: ${message}`);
                return;
            }

            toast.success("User is registered successfully!");
            return router.refresh()
        } catch (error) {
            toast.error("Failed to register user.");
            console.log(error);
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePasswordConfirmationVisibility = () => {
        setShowPasswordConfirmation(!showPasswordConfirmation);
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        if (passwordConfirmation !== "") {
            validatePasswordMatch(value, passwordConfirmation);
        }
    };

    const handlePasswordConfirmationChange = (value: string) => {
        setPasswordConfirmation(value);
        validatePasswordMatch(password, value);
    };

    const validatePasswordMatch = (password: string, confirmPassword: string) => {
        setPasswordMatch(password === confirmPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        createUser();

    };

    return (
        <form className="bg-white my-8 p-8 rounded-xl shadow-md w-full md:w-1/2" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3 mb-8">
                <label htmlFor="name" className="font-semibold">Name</label>
                <input
                    type="text"
                    id="name"
                    placeholder="Your Name..."
                    className="block w-full px-4 py-2 text-sm font-normal rounded-full shadow-xs text-gray-900 bg-transparent border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

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
                        onChange={(e) => handlePasswordChange(e.target.value)}
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

            <div className="flex flex-col gap-3 mb-8">
                <label htmlFor="password_confirmation" className="font-semibold">Password Confirmation</label>
                <div className="relative">
                    <input
                        type={showPasswordConfirmation ? "text" : "password"}
                        id="password_confirmation"
                        placeholder="Your Password..."
                        className="block w-full px-4 py-2 text-sm font-normal rounded-full shadow-xs text-gray-900 bg-transparent border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                        onChange={(e) => handlePasswordConfirmationChange(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={togglePasswordConfirmationVisibility}
                        className={`absolute inset-y-0 right-4 flex items-center ${!passwordMatch ? "bottom-5" : ""}`}
                    >
                        {showPasswordConfirmation ? "🙈" : "🐵"}
                    </button>
                    {!passwordMatch && (
                        <p className="text-red-500 text-sm mt-1">Passwords do not match.</p>
                    )}
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
                Sign Up
            </button>

            <span className="mt-4 block">Already have an account? <Link href="/auth/signin" className="hover:font-semibold">Sign In Here!</Link></span>
        </form>
    )
}

export default FormSignUp