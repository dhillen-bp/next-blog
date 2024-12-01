"use client";;
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IArticle } from "@/models/Article";
import ConfirmModal from "@/components/ConfirmModal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ArticleTablePage = () => {
    const router = useRouter();
    const [articles, setArticle] = useState<IArticle[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const getAllArticles = async () => {
        try {
            const response = await fetch("/api/articles");
            if (!response.ok) {
                throw new Error("Failed to fetch articles");
            }
            const data = await response.json();
            console.log(data);

            setArticle(data);
        } catch (error) {
            console.error("Error fetching articles:", error);
        }
    };

    const openModal = (slug: string) => {
        setSelectedItem(slug);
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
                const response = await fetch(`/api/articles/${selectedItem}`, {
                    method: "DELETE",
                });
                console.log("response:", response);

                if (!response.ok) {
                    throw new Error("Failed to delete item");
                }
                // Perbarui state articles
                setArticle((prevCategories) =>
                    prevCategories.filter((article) => article.slug !== selectedItem)
                );

                toast.success("Category deleted successfully!");
                router.refresh();
            } catch (error) {
                console.error("Error deleting item:", error);
            } finally {
                closeModal();
            }
        }
    };

    useEffect(() => {
        getAllArticles();
    }, [])


    return (
        <div className="w-full space-y-6 px-6 md:px-16">
            <h3>Articles Table</h3>
            <Link href="/my-dashboard/articles/form" className="bg-blue-500 flex justify-center items-center w-fit px-3 py-1.5 rounded-full text-sm text-white">Create Article</Link>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Thumbnail</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>

                    {articles.map((article, index) => (
                        <TableRow key={article._id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{article.title}</TableCell>
                            <TableCell>
                                <Image
                                    src={`/${article.thumbnail.replace(/\\/g, "/")}`}
                                    alt=""
                                    width={50}
                                    height={50}
                                    className="w-12 h-12 object-cover"
                                />
                            </TableCell>
                            <TableCell>
                                <span className="px-2 py-1 bg-gray-100 rounded mr-1">
                                    {article.category.name}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-3">
                                    <Link href={`/my-dashboard/articles/form/${article.slug}`} className="bg-blue-500 flex justify-center items-center w-fit px-4 py-1.5 rounded-full text-sm text-white">Edit</Link>
                                    <button onClick={() => openModal(article.slug)}
                                        className="bg-red-500 flex justify-center items-center w-fit px-4 py-1.5 rounded-full text-sm text-white">Delete</button>
                                </div>
                                <ConfirmModal
                                    isOpen={isModalOpen}
                                    title="Delete Confirmation"
                                    message="Are you sure you want to delete this article?"
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
}

export default ArticleTablePage