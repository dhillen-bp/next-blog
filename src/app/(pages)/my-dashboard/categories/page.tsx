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

    const [searchQuery, setSearchQuery] = useState("");

    const [categories, setCategories] = useState<ICategory[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 2,
        totalPages: 1,
        totalItems: 0,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const getAllCategories = async (query = "", page = 1) => {
        try {
            const response = await fetch(
                `/api/categories?search=${query}&page=${page}&limit=${pagination.limit}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }
            const data = await response.json();
            setCategories(data.categories);
            setPagination(data.pagination); // Simpan informasi pagination
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

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, page: newPage }));
            getAllCategories(searchQuery, newPage); // Panggil ulang API dengan halaman baru
        }
    };


    useEffect(() => {
        const debounceSearch = setTimeout(() => {
            setPagination((prev) => ({ ...prev, page: 1 })); // Reset ke halaman pertama
            getAllCategories(searchQuery, 1);
        }, 300); // Debounce 300ms untuk menghindari terlalu banyak request

        return () => clearTimeout(debounceSearch); // Bersihkan debounce sebelumnya
    }, [searchQuery]);

    return (
        <div className="w-full space-y-6 px-6 md:px-16">
            <h3>Categories Table</h3>
            <input
                type="text"
                placeholder="Search categories..."
                className="border px-4 py-2 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

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
                            <TableCell className="font-medium">
                                {(pagination.page - 1) * pagination.limit + index + 1}
                            </TableCell>
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

            <div className="flex flex-col items-center space-y-4 mt-4">
                <div>
                    Showing {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.totalItems)} to{" "}
                    {Math.min(pagination.page * pagination.limit, pagination.totalItems)} of {pagination.totalItems} entries
                </div>
                <div className="flex justify-between items-center space-x-4">
                    {/* Tombol Previous */}
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                    >
                        Previous
                    </button>

                    {/* Tombol nomor halaman */}
                    <div className="flex space-x-2">
                        {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`px-4 py-2 rounded ${pagination.page === pageNumber
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-300 text-black"
                                    }`}
                            >
                                {pageNumber}
                            </button>
                        ))}
                    </div>

                    {/* Tombol Next */}
                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            </div>


        </div>
    );
};

export default TableCategoryPage;
