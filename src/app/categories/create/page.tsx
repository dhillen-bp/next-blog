"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "react-toastify";

const CreateCategoryPage = () => {
    const [name, setName] = useState("");
    const [icon, setIcon] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        createCategory();
    };

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
        } catch (error) {
            console.error("Error creating category:", error);
            toast.error("Failed to create category.");
        }
    }

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
                    />
                </div>

                <div className="grid w-full max-w-sm items-center gap-3 mb-8">
                    <Label htmlFor="icon">Icon</Label>
                    <Input
                        id="icon"
                        name="icon"
                        type="file"
                        onChange={(e) => setIcon(e.target.files?.[0] || null)}
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
