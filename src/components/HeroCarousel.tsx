"use client"

import Image from 'next/image';
import { Separator } from './ui/separator';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';
import "./swiper-style.css";
import { IArticle } from '@/models/Article';
import Link from 'next/link';

const HeroCarousel = ({ recentArticles }: { recentArticles: IArticle[] }) => {
    return (
        <Swiper
            spaceBetween={0} // Jarak antar slide
            slidesPerView={1} // Hanya satu slide yang ditampilkan
            loop={true} // Mengulang carousel secara terus-menerus
            autoplay={{
                delay: 5000,
                disableOnInteraction: false,
            }} // Waktu otomatis untuk pindah slide
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            modules={[Autoplay, EffectFade, Pagination]} effect="fade"
        >
            {recentArticles.map((article) => (
                <div key={article.slug}>
                    <SwiperSlide>
                        <header className="relative max-h-screen h-screen z-0 -mt-16">
                            <Image
                                src={`/${article?.thumbnail.replace(/\\/g, "/")}`}
                                alt="Hero Banner"
                                layout="fill"
                                objectFit="cover"
                                className="absolute inset-0 "
                            />

                            <div className="absolute inset-0 bg-black bg-opacity-50" />

                            <div className="absolute inset-0 text-white flex flex-col bottom-16 justify-end items-center text-center space-y-6 ">
                                <div className="flex gap-3">
                                    <div className="flex flex-row items-center gap-3">
                                        <Image
                                            src={'/images/profile.jpeg'}
                                            alt="Author Photo"
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 rounded-full"
                                        />
                                        <span>Author</span>
                                    </div>

                                    <Separator orientation="vertical" className="bg-white h-10 mx-3" />

                                    <div className="flex flex-row items-center gap-3 text-sm">
                                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-white">
                                            <svg
                                                width="60%"
                                                height="60%"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="text-black"
                                            >
                                                <path
                                                    d="M21 10H3M16 2V6M8 2V6M7.8 22H16.2C17.8802 22 18.7202 22 19.362 21.673C19.9265 21.3854 20.3854 20.9265 20.673 20.362C21 19.7202 21 18.8802 21 17.2V8.8C21 7.11984 21 6.27976 20.673 5.63803C20.3854 5.07354 19.9265 4.6146 19.362 4.32698C18.7202 4 17.8802 4 16.2 4H7.8C6.11984 4 5.27976 4 4.63803 4.32698C4.07354 4.6146 3.6146 5.07354 3.32698 5.63803C3 6.27976 3 7.11984 3 8.8V17.2C3 18.8802 3 19.7202 3.32698 20.362C3.6146 20.9265 4.07354 21.3854 4.63803 21.673C5.27976 22 6.11984 22 7.8 22Z"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                        <span>
                                            {new Date(article.createdAt).toLocaleDateString('en-EN', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>

                                    <Separator orientation="vertical" className="bg-white h-10 mx-3" />

                                    <div className="flex flex-row items-center gap-3">
                                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-white">
                                            <svg
                                                width="60%"
                                                height="60%"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="text-black"
                                            >
                                                <path
                                                    d="M5 3L2 6M22 6L19 3M6 19L4 21M18 19L20 21M12 9V13L14 15M12 21C14.1217 21 16.1566 20.1571 17.6569 18.6569C19.1571 17.1566 20 15.1217 20 13C20 10.8783 19.1571 8.84344 17.6569 7.34315C16.1566 5.84285 14.1217 5 12 5C9.87827 5 7.84344 5.84285 6.34315 7.34315C4.84285 8.84344 4 10.8783 4 13C4 15.1217 4.84285 17.1566 6.34315 18.6569C7.84344 20.1571 9.87827 21 12 21Z"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                        <span>5 menit yang lalu</span>
                                    </div>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold">{article.title}</h1>
                                <p className="text-lg md:text-xl"
                                    dangerouslySetInnerHTML={{
                                        __html: article.content.length > 100
                                            ? `${article.content.slice(0, 100)}...`
                                            : article.content,
                                    }}>
                                </p>
                                <Link href={`/articles/${article.slug}`} className="bg-yellow-500 text-slate-950 rounded-full py-2 px-6">
                                    Read More
                                </Link>
                            </div>
                        </header>
                    </SwiperSlide>
                </div>
            ))
            }

        </Swiper >
    );
};

export default HeroCarousel;
