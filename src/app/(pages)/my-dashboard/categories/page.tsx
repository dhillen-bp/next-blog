"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { ICategory } from "@/models/Category";
import { useState, useEffect } from "react";
import Link from "next/link";
import ConfirmModal from "@/components/ConfirmModal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const TableCategoryPage = () => {
    const router = useRouter();

    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const getAllCategories = async () => {
        try {
            const response = await fetch("/api/categories");
            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const openModal = (id: string) => {
        setSelectedItem(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleDelete = async () => {
        console.log("selected item: ", selectedItem);

        if (selectedItem) {
            try {
                const response = await fetch(`/api/categories/${selectedItem}`, {
                    method: "DELETE",
                });
                console.log("response:", response);

                if (!response.ok) {
                    throw new Error("Failed to delete item");
                }
                // Perbarui state categories
                setCategories((prevCategories) =>
                    prevCategories.filter((category) => category.slug !== selectedItem)
                );

                toast.success("Category deleted successfully!");
                router.refresh();
            } catch (error) {
                console.error("Error deleting item:", error);
                alert("Failed to delete item");
            } finally {
                closeModal();
            }
        }
    };


    useEffect(() => {
        getAllCategories();
    }, []);

    return (
        <div className="w-full space-y-6 px-6 md:px-16">
            <h3>Categories Table</h3>
            <Link href="/my-dashboard/categories/form" className="bg-blue-500 flex justify-center items-center w-fit px-3 py-1.5 rounded-full text-sm text-white">Create Category</Link>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Icon</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((category, index) => (
                        <TableRow key={category._id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>
                                <Image
                                    src={`/${category.icon.replace(/\\/g, "/")}`}
                                    alt={`Icon of ${category.name}`}
                                    width={50}
                                    height={50}
                                    className="w-12 h-12 object-cover"
                                />
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-3">
                                    <Link href={`/my-dashboard/categories/form/${category.slug}`} className="bg-blue-500 flex justify-center items-center w-fit px-4 py-1.5 rounded-full text-sm text-white">Edit</Link>
                                    <button onClick={() => openModal(category.slug)}
                                        className="bg-red-500 flex justify-center items-center w-fit px-4 py-1.5 rounded-full text-sm text-white">Delete</button>
                                </div>
                                <ConfirmModal
                                    isOpen={isModalOpen}
                                    title="Delete Confirmation"
                                    message="Are you sure you want to delete this category?"
                                    confirmText="Delete"
                                    cancelText="Cancel"
                                    onClose={closeModal}
                                    onConfirm={handleDelete}
                                />

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TableCategoryPage;
