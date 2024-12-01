"use client";;
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";

const EditCategoryPage = () => {
    const params = useParams();
    const slug = params.slug;
    const router = useRouter();

    const [name, setName] = useState("");
    const [icon, setIcon] = useState<File | null>(null);
    const [currentIconUrl, setCurrentIconUrl] = useState<string | null>(null);

    const getCategory = async () => {
        try {
            const response = await fetch(`/api/categories/${slug}`);
            if (response.ok) {
                const data = await response.json();
                setName(data.name || "");
                setCurrentIconUrl(data.icon || null);

            } else {
                toast.error("Failed to fetch category.");
            }
        } catch (error) {
            console.error("Error fetching category:", error);
            toast.error("An error occurred while fetching the category.");
        }
    };

    const updateCategory = async () => {
        const formData = new FormData();
        formData.append("name", name);
        if (icon) {
            formData.append("icon", icon);
        } else {
            formData.append("icon", ""); // Kirim string kosong jika tidak ada gambar baru
        }

        try {
            const response = await fetch(`/api/categories/${params.slug}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                const { message } = await response.json();
                toast.error(`Error: ${message}`);
                return;
            }

            toast.success("Category updated successfully!");
            router.push("/my-dashboard/categories");
        } catch (error) {
            console.error("Error updating category:", error);
            toast.error("Failed to update category.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (params.slug) {
            updateCategory();
        }
    };

    useEffect(() => {
        if (params.slug) {
            getCategory();
        }
    }, [slug]);

    return (
        <div className="py-16 px-6 md:px-16">
            <h2 className="text-4xl font-bold inline-block relative">
                Edit Category
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
                    {currentIconUrl && !icon && (
                        <div className="mb-4">
                            <p>Current Icon:</p>
                            <Image
                                src={`/${currentIconUrl.replace(/\\/g, "/")}`}
                                alt="Current Icon"
                                width={1920}
                                height={1080}
                                className="w-32 h-32 object-cover border border-gray-300 rounded"
                            />
                        </div>
                    )}
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

export default EditCategoryPage;
