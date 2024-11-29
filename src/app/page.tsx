"use client";
import HeroCarousel from "@/components/HeroCarousel";
import { IArticle } from "@/models/Article";
import { ICategory } from "@/models/Category";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';

export default function Home() {

  const [recentArticles, setRecentArticles] = useState<IArticle[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const getRecentArticles = async () => {
    try {
      const response = await fetch(`/api/articles/recent?limit=3`);

      if (!response.ok) {
        throw new Error("Failed to fetch recent articles");
      }
      const data: IArticle[] = await response.json();
      setRecentArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  }

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

  useEffect(() => {
    getRecentArticles();
    getCategories();
  }, []);

  return <>
    <HeroCarousel recentArticles={recentArticles} />

    <div className="px-6 md:px-16 py-12 md:py-16">
      <div className="space-y-10">
        <h2 className="text-4xl font-bold inline-block relative">
          Category
          <span className="absolute left-0 -bottom-1 w-full h-[10px] -z-[1] bg-gradient-to-r from-green-500 to-blue-500"></span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              href={`/articles/category/${category.slug}`}
              key={category._id}
              className="flex items-center justify-center gap-6 md:gap-10 bg-gradient-to-r from-green-500 to-blue-500 py-3 rounded"
            >
              <div>
                <Image
                  src={`/${category.icon.replace(/\\/g, "/")}`}
                  alt="Icon"
                  width={50}
                  height={50}
                  className="object-center object-cover"
                />
              </div>
              <span className="text-xl font-semibold">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16 space-y-12">
        <h2 className="text-4xl font-bold inline-block relative">
          Trending News
          <span className="absolute left-0 -bottom-1 w-full h-[10px] -z-[1] bg-gradient-to-r from-green-500 to-blue-500"></span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentArticles.map((article) => (
            <div className="relative bg-white shadow-md overflow-hidden rounded-xl group" key={article._id}>
              <div className="w-full h-[368px] overflow-hidden rounded-xl">
                <Image
                  src={`/${article.thumbnail.replace(/\\/g, "/")}`}
                  alt="Thumbnail"
                  fill
                  className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              </div>

              {/* Elemen Transisi */}
              <div className="absolute left-0 right-0 bottom-0 transform translate-y-full group-hover:translate-y-0 group-hover:bottom-4 transition-transform duration-500 ease-in-out bg-white flex flex-col justify-center mx-4 rounded-xl p-3 shadow-lg">
                <span className="text-sm text-black">
                  {new Date(article.createdAt).toLocaleDateString('en-EN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <h4 className="mt-1 text-lg font-semibold text-black">{article.title}</h4>
                <Link href={`/articles/${article.slug}`} className="text-sm mt-2 px-4 py-2 flex w-1/2 justify-center items-center bg-blue-500 text-white text-center hover:bg-blue-600 rounded-xl transition-all duration-300 ease-in-out">Read More</Link>
              </div>

              {/* Elemen Default */}
              <div className="group-hover:hidden absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-transparent to-transparent p-4">
                <span className="block text-sm text-white">
                  {new Date(article.createdAt).toLocaleDateString('en-EN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <h4 className="mt-1 text-lg font-semibold text-white">{article.title}</h4>
              </div>
            </div>

          ))}
        </div>

      </div>
    </div>
  </>;
}
