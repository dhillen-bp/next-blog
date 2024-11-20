import HeroCarousel from "@/components/HeroCarousel";
import Image from "next/image";

const categories = [
  { id: 1, name: 'Food', icon: '🍔' },
  { id: 2, name: 'Drinks', icon: '🍹' },
  { id: 3, name: 'Music', icon: '🎵' },
  { id: 4, name: 'Travel', icon: '✈️' },
];

export default function Home() {
  return (
    <>
      <HeroCarousel />

      <div className="px-6 md:px-16 py-12 md:py-16">
        <div className="space-y-10">
          <h2 className="text-4xl font-bold inline-block relative">
            Category
            <span className="absolute left-0 -bottom-1 w-full h-[10px] -z-[1] bg-gradient-to-r from-green-500 to-blue-500"></span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-center gap-6 bg-gradient-to-r from-green-500 to-blue-500 py-3 rounded"
              >
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 48 48">
                    <path d="M43.7 25.3c.9-1.1 1.2-2.4.9-3.7-1.4-7-6.5-14.5-14.5-15.2C29.2 3.8 26.8 2 24 2s-5.2 1.8-6.1 4.4c-8 .7-13.1 8.2-14.5 15.2-.3 1.3.1 2.7.9 3.7.8.9 1.9 1.5 3.1 1.6l0 0h33.2l0 0C41.8 26.8 42.9 26.3 43.7 25.3zM12.5 20c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5S13.3 20 12.5 20zM16.5 16c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5c.8 0 1.5.7 1.5 1.5S17.3 16 16.5 16zM20.5 20c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5S21.3 20 20.5 20zM8 29l3.3 10.9c.6 2.4 2.8 4.1 5.3 4.1h14.8c2.5 0 4.7-1.7 5.3-4.1L40 29H8zM19.5 32c.8 0 1.5.7 1.5 1.5S20.3 35 19.5 35 18 34.3 18 33.5 18.7 32 19.5 32zM29.5 39.6C27.9 41 26 41.7 24 41.7s-3.9-.7-5.5-2.1c-.6-.6-.7-1.5-.1-2.1.5-.6 1.5-.7 2.1-.1 2 1.8 5 1.8 7 0 .6-.6 1.6-.5 2.1.1C30.2 38.1 30.1 39.1 29.5 39.6zM28.5 35c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5S29.3 35 28.5 35z"></path>
                  </svg>
                </div>
                <span className="text-xl font-semibold">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 space-y-12">
          <h2 className="text-4xl font-bold inline-block relative">
            Trending News
            <span className="absolute left-0 -bottom-1 w-full h-[10px] -z-[1] bg-gradient-to-r from-green-500 to-blue-500"></span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative bg-white shadow-md rounded-lg overflow-hidden">
              <div className="relative w-full h-[368px] rounded-xl">
                <Image
                  src="https://uiparadox.co.uk/public/templates/blog-insight/assets/media/blog/trending-1.png"
                  alt="Thumbnail"
                  fill
                  className="object-cover rounded-xl"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-transparent to-transparent p-4">
                  <span className="block text-sm text-white">17 Agustus 2024</span>
                  <h4 className="mt-1 text-lg font-semibold text-white">Title</h4>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>

  );
}
