"use client";;
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const CreateCategoryPage = () => {
    const router = useRouter();

    const [name, setName] = useState("");
    const [icon, setIcon] = useState<File | null>(null);

    const createCategory = async () => {
        const formData = new FormData();
        formData.append("name", name);
        if (icon) formData.append("icon", icon);

        try {
            const response = await fetch("/api/categories", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const { message } = await response.json();
                alert(`Error: ${message}`);
                return;
            }

            toast.success("Category created successfully!");
            setName("");
            setIcon(null);
            router.push('/my-dashboard/categories');
        } catch (error) {
            console.error("Error creating category:", error);
            toast.error("Failed to create category.");
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        createCategory();
    };

    return (
        <div className="py-16 px-6 md:px-16">
            <h2 className="text-4xl font-bold inline-block relative">
                Create Category
                <span className="absolute left-0 -bottom-1 w-full h-[10px] -z-[1] bg-gradient-to-r from-green-500 to-blue-500"></span>
            </h2>

            <form className="my-12" onSubmit={handleSubmit}>
                <div className="grid w-full max-w-sm items-center gap-3 mb-8">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        type="text"
                        id="name"
                        placeholder="Category Name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full px-4 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none leading-relaxed"
                    />
                </div>

                <div className="grid w-full max-w-sm items-center gap-3 mb-8">
                    <Label htmlFor="icon">Icon</Label>
                    <input
                        id="icon"
                        name="icon"
                        type="file"
                        onChange={(e) => setIcon(e.target.files?.[0] || null)}
                        className="block w-full px-4 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none leading-relaxed file:bg-green-50 file:rounded-full file:border-0 file:py-1 file:px-6"
                    />
                </div>

                <button type="submit" className="bg-slate-900 hover:bg-black rounded text-white hover px-4 py-1.5">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CreateCategoryPage;
