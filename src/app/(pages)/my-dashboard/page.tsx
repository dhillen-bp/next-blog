"use client"

import { useEffect, useState } from "react";

const DashboardPage = () => {
    const [data, setData] = useState({
        totalCategories: 0,
        totalArticles: 0,
        totalMyArticles: 0,
    });

    const fetchData = async () => {
        try {
            const response = await fetch("/api/dashboard");
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const result = await response.json();
            setData(result);
        } catch (err) {
            console.error(err);

        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="w-full px-6 md:px-16 py-6 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Total Categories */}
            <div className="border border-slate-300 bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center">
                <h3 className="text-xl font-semibold text-slate-800">Total Categories</h3>
                <p className="text-3xl font-bold text-blue-500 mt-2">{data.totalCategories}</p>
                <p className="text-slate-600 mt-1">Categories available</p>
            </div>

            {/* Card 2: Total Articles */}
            <div className="border border-slate-300 bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center">
                <h3 className="text-xl font-semibold text-slate-800">Total Articles</h3>
                <p className="text-3xl font-bold text-green-500 mt-2">{data.totalArticles}</p>
                <p className="text-slate-600 mt-1">Articles published</p>
            </div>

            {/* Card 3: Popular Article */}
            <div className="border border-slate-300 bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center">
                <h3 className="text-xl font-semibold text-slate-800">Total My Articles</h3>
                <p className="text-3xl font-bold text-green-500 mt-2">{data.totalMyArticles}</p>
                <p className="text-slate-600 mt-1">Articles published</p>
            </div>
        </div>
    );
};

export default DashboardPage;
