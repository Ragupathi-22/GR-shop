"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/services/api";

type CategoryGridProps = {
  categories: Category[];
};

const SingleItem = ({ item }: { item: Category }) => {
  return (
    <Link
      href={`/products?category=${item.id}`}
      className="group flex flex-col items-center"
    >
      <div className="relative max-w-[130px] w-full h-32.5 rounded-full flex items-center justify-center mb-4 overflow-hidden shadow-md transition-shadow duration-300 group-hover:shadow-xl">
        <Image
          src={item.image?.src || "/images/default-category.png"}
          alt={item.name}
          width={82}
          height={62}
          className="object-contain transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent rounded-full" />
      </div>
      <div className="flex flex-col justify-center items-center">
        <h3 className="inline-block font-medium text-center text-gray-700 bg-gradient-to-r from-blue-500 to-blue-500 bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size,color] duration-500 group-hover:bg-[length:100%_3px] group-hover:text-blue-500">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{item.count} products</p>
      </div>
    </Link>
  );
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const [catList, setCatList] = useState<Category[]>([]);

  useEffect(() => {
    setCatList(categories);
  }, [categories]);

  return (
    <section className="overflow-hidden pt-6 pb-10 relative">
  <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 relative">
    <Swiper
      modules={[FreeMode,Navigation, Pagination]}
      slidesPerView={6}
      spaceBetween={30}
      freeMode={true}
      navigation={{
        prevEl: ".swiper-button-prev-custom",
        nextEl: ".swiper-button-next-custom",
      }}
      pagination={{ clickable: true }}
      breakpoints={{
        0: { slidesPerView: 2 },
        640: { slidesPerView: 3 },
        1000: { slidesPerView: 4 },
        1200: { slidesPerView: 6 },
      }}
    >
      {catList.map((item) => (
        <SwiperSlide key={item.id}>
          <SingleItem item={item} />
        </SwiperSlide>
      ))}
    </Swiper>

    {/* Custom navigation buttons */}
    <div className="swiper-button-prev-custom absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 cursor-pointer text-gray-700 hover:text-blue-500">
      &#10094;
    </div>
    <div className="swiper-button-next-custom absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 cursor-pointer text-gray-700 hover:text-blue-500">
      &#10095;
    </div>
  </div>
</section>
  );
}
