"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch user data from server
    const fetchUserData = async () => {
        try {
            // Memanggil API untuk mengambil data pengguna
            const response = await fetch("/api/auth/me", {
                credentials: "include", // Mengirim cookies yang httpOnly
            });

            // Jika berhasil, ambil data pengguna
            const data = await response.json();
            // console.log("data: ", data);

            if (data.user == null) {
                setUser(null)
            }
            setUser(data);
        } catch (error) {
            // Tangani jika terjadi kesalahan pada API call tanpa menampilkan error di console
            setUser(null);
        } finally {
            setLoading(false); // Selesaikan loading
        }
    };

    useEffect(() => {
        fetchUserData(); // Panggil fungsi untuk mengambil data pengguna saat komponen pertama kali di-render
    }, []); // Kosongkan dependensi agar hanya dipanggil sekali

    // Jika loading, jangan render komponen lainnya
    if (loading) {
        return null; // Bisa diganti dengan loading spinner jika diperlukan
    }
    // console.log("context user: ", user);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
