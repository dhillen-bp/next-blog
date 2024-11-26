"use client";
import ArticleCard from "@/components/ArticleCard";
import { IArticle } from "@/models/Article";
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
                    <ArticleCard key={article._id} article={article} />
                ))}
            </div>
        </div>
    );
};

export default ArticlesPage;
