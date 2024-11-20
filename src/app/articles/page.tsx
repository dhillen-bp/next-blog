"use client"

import { IArticle } from "@/models/Article";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';

const ArticlesPage = () => {
    const [articles, setArticles] = useState<IArticle[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getArticles = async () => {
        try {
            const response = await fetch("/api/articles");
            if (!response.ok) {
                throw new Error("Failed to fetch articles");
            }
            const data: IArticle[] = await response.json();
            setArticles(data);
        } catch (error) {
            console.error("Error fetching articles:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getArticles();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="px-6 md:px-16 py-12 md:py-16 bg-[#fdfdfd]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <div
                        key={article._id}
                        className="rounded-xl relative group transition-all overflow-hidden"
                    >
                        <div className="rounded-xl overflow-hidden">
                            <Image
                                src={`/${article.thumbnail.replace(/\\/g, "/")}`}
                                alt="Thumbnail"
                                width={600}
                                height={600}
                                objectFit="cover"
                                className="rounded-xl shadow group-hover:scale-105 object-center transition-transform duration-300 h-[250px] w-full ease-in-out "
                            />
                        </div>
                        <div className="flex flex-col justify-between space-y-3">
                            <span className="text-sm text-gray-500 mt-3">
                                {new Date(article.createdAt).toLocaleDateString('en-EN', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>
                            <h2 className="text-2xl font-bold">{article.title}</h2>
                            <p className="text-md text-gray-700 line-clamp-3"
                                dangerouslySetInnerHTML={{
                                    __html: article.content.length > 100
                                        ? `${article.content.slice(0, 100)}...`
                                        : article.content,
                                }}>
                            </p>
                            <span className="text-sm text-gray-500">By Author</span>
                            <Link href={`/articles/${article.slug}`} className="mt-4 px-4 py-2 w-full bg-blue-500 text-white text-center hover:bg-blue-600 rounded-xl transition-all duration-300 ease-in-out">
                                Read More
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArticlesPage;
