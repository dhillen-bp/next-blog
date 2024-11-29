"use client"

import { IArticle } from "@/models/Article";
import Image from "next/image"
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from 'react';

const ArticleDetailPage = () => {
    const [article, setArticle] = useState<IArticle | null>(null);
    const [recentArticles, setRecentArticles] = useState<IArticle[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const params = useParams();

    const getArticle = async () => {
        try {
            if (!params?.slug) throw new Error("Invalid slug");
            const response = await fetch(`/api/articles/${params.slug}`);
            if (!response.ok) {
                throw new Error("Failed to fetch article");
            }
            const data: IArticle = await response.json();
            setArticle(data);

        } catch (error) {
            console.error("Error fetching article:", error);
        } finally {
            setLoading(false);
        }
    };

    const getRecentArticles = async () => {
        try {
            if (!params?.slug) throw new Error("Invalid slug");
            const response = await fetch(`/api/articles/recent?exclude=${params.slug}&limit=6`);
            if (!response.ok) {
                throw new Error("Failed to fetch recent articles");
            }
            const data: IArticle[] = await response.json();
            setRecentArticles(data);
        } catch (error) {
            console.error("Error fetching articles:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getArticle();
        getRecentArticles();
    }, [params.slug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="px-6 md:px-16 py-16">
            <div className="grid md:grid-cols-6 grid-cols-1 gap-8 md:gap-12">
                <div className="md:col-span-4  rounded-t-xl space-y-6">
                    <Image src={`/${article?.thumbnail.replace(/\\/g, "/")}`} alt="Thumbnail" width={1920} height={1080} className="w-full object-cover rounded-xl" />
                    <h6 className="font-bold text-2xl">{article?.title}</h6>
                    {article?.content ? (
                        <p
                            className=""
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        ></p>
                    ) : (
                        <p>No content available</p>
                    )}

                </div>

                <div className="md:col-span-2 rounded-xl shadow-sm bg-green-50 p-5 space-y-6 h-fit">
                    <h2 className="text-xl font-bold inline-block relative z-[1]">
                        Recent Articles
                        <span className="absolute left-0 bottom-[5px] w-full h-[6px] -z-[1] bg-gradient-to-r from-green-500 to-blue-500"></span>
                    </h2>
                    <div className="space-y-8">
                        {recentArticles.map((recent) => (
                            <Link href={`/articles/${recent.slug}`} className="flex gap-4 group cursor-pointer" key={recent._id}>
                                <div
                                    className="overflow-hidden rounded-xl h-[100px] w-[160px] flex-shrink-0"
                                >
                                    <Image
                                        src={`/${recent.thumbnail.replace(/\\/g, "/")}`}
                                        alt="Thumbnail"
                                        width={1920}
                                        height={1080}
                                        className="object-cover rounded-xl w-full h-full group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="space-y-3 flex justify-center flex-col">
                                    <span className="text-xs opacity-60">
                                        {new Date(recent.createdAt).toLocaleDateString('en-EN', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </span>
                                    <h6 className="font-semibold text-sm group-hover:text-blue-500 transition-colors duration-300">
                                        {recent?.title}
                                    </h6>
                                </div>
                            </Link>

                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ArticleDetailPage