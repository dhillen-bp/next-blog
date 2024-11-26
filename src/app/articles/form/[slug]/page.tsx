"use client"

import { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { ICategory } from '@/models/Category';
import { toast } from 'react-toastify';
import { useParams, useRouter } from "next/navigation";

const API_KEY_TYNYMCE = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;

const EditArticlePage = () => {
    const params = useParams();
    const router = useRouter();

    const [categories, setCategories] = useState<ICategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [title, setTitle] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState<string | null>(null);
    const [content, setContent] = useState("");

    const editorRef = useRef<TinyMCEEditor | null>(null);
    const thumbnailInputRef = useRef<HTMLInputElement | null>(null)

    const getCategories = async () => {
        try {
            const response = await fetch("/api/categories"); // Endpoint GET categories
            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const getArticle = async () => {
        try {
            const response = await fetch(`/api/articles/${params.slug}`);
            if (response.ok) {
                const data = await response.json();
                setTitle(data.title || "");
                setSelectedCategory(data.categories || "");
                setCurrentThumbnailUrl(data.thumbnail || null);
                setContent(data.content || "");

                // Tunggu data content di-update sebelum mengatur editor
                if (editorRef.current) {
                    editorRef.current.setContent(data.content || "");
                }
            } else {
                toast.error("Failed to fetch category.");
            }
        } catch (error) {
            console.error("Error fetching article:", error);
        }
    };


    const updateArticle = async () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("categories", selectedCategory);
        if (thumbnail) formData.append("thumbnail", thumbnail);

        if (editorRef.current) {
            const contentFromEditor = editorRef.current.getContent();
            formData.append("content", contentFromEditor);
        }

        try {
            const response = await fetch(`/api/articles/${params.slug}`, {
                method: "PUT",
                body: formData,
            });

            console.log("response: ", response);

            if (!response.ok) {
                const { message } = await response.json();
                toast.error(`Error: ${message}`);
                return;
            }

            const updatedArticle = await response.json();

            toast.success("Category updated successfully!");
            router.push(`/articles/form/${updatedArticle.slug}`);
        } catch (error) {
            toast.error("Failed to update category.");
        }
    }

    useEffect(() => {
        getCategories();
        getArticle();
    }, [params.slug]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (editorRef.current) {
            setContent(editorRef.current.getContent());
        }
        await updateArticle();
    };

    return (
        <div className="py-16 px-6 md:px-16">
            <h2 className="text-4xl font-bold inline-block relative">
                Edit Article
                <span className="absolute left-0 -bottom-1 w-full h-[10px] -z-[1] bg-gradient-to-r from-green-500 to-blue-500"></span>
            </h2>

            <form className="my-12" onSubmit={handleSubmit}>
                <div className="mb-8 max-w-md ">
                    <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">Title <svg width="7" height="7" className="ml-1" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z" fill="#EF4444"></path></svg>
                    </label>
                    <input type="text" name='title' id="default-search" className="block w-full px-4 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none leading-relaxed" required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="mb-8  max-w-md ">
                    <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">Category <svg width="7" height="7" className="ml-1" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z" fill="#EF4444"></path></svg>
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="h-12 border border-gray-300 text-gray-600 text-base  block w-full py-1.5 px-4 focus:outline-none rounded-full"
                        required
                    >
                        <option value="" disabled>
                            Select a category
                        </option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-8 max-w-md ">
                    <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">Thumbnail <svg width="7" height="7" className="ml-1" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z" fill="#EF4444"></path></svg>
                    </label>
                    {currentThumbnailUrl && !thumbnail && (
                        <div className="mb-4">
                            <img
                                src={`/${currentThumbnailUrl.replace(/\\/g, "/")}`}
                                alt="Current Thumbnail"
                                className="w-56 h-5w-56 object-cover border border-gray-300 rounded"
                            />
                        </div>
                    )}
                    <input type="file" ref={thumbnailInputRef} name='thumbnail' id="default-search" className="block w-full px-4 py-2 text-sm font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none leading-relaxed file:bg-green-50 file:rounded-full file:border-0 file:py-1 file:px-6"
                        onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                    />
                </div>

                <div className="mb-8 ">
                    <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">Content <svg width="7" height="7" className="ml-1" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z" fill="#EF4444"></path></svg>
                    </label>
                    <Editor
                        apiKey={API_KEY_TYNYMCE}
                        onInit={(_evt, editor) => editorRef.current = editor}
                        init={{
                            height: 500,
                            menubar: false,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                    />
                </div>
                <button type="submit" className="bg-slate-900 hover:bg-black rounded-full text-white hover px-5 py-1.5">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default EditArticlePage