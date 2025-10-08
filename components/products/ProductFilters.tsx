"use client";

import React, { useState } from "react";
import { SlidersIcon, XIcon } from "lucide-react";

type FilterProps = {
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  activeFilters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
};

const ProductFilters: React.FC<FilterProps> = ({
  categories,
  activeFilters,
  onFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: activeFilters.min_price || "",
    max: activeFilters.max_price || "",
  });

  const handleCategoryChange = (categoryId: number) => {
    onFilterChange({
      ...activeFilters,
      category: categoryId.toString(), // keep consistent type
    });
  };

  const handlePriceChange = () => {
    onFilterChange({
      ...activeFilters,
      min_price: priceRange.min || undefined,
      max_price: priceRange.max || undefined,
    });
  };

  const handleClearFilters = () => {
    setPriceRange({ min: "", max: "" });
    onFilterChange({});
  };

  const toggleFilters = () => setIsOpen(!isOpen);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      {/* Mobile filter toggle */}
      <div className="md:hidden p-4 border-b">
        <button
          onClick={toggleFilters}
          className="w-full flex items-center justify-between text-gray-700 font-medium"
        >
          <span className="flex items-center">
            <SlidersIcon className="h-5 w-5 mr-2" />
            Filters
          </span>
          <span className="text-sm text-blue-600">
            {Object.keys(activeFilters).length > 0
              ? `${Object.keys(activeFilters).length} applied`
              : "None applied"}
          </span>
        </button>
      </div>

      {/* Filter content */}
      <div className={`${isOpen ? "block" : "hidden"} md:block p-4`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-gray-800">Filters</h3>
          {Object.keys(activeFilters).length > 0 && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <XIcon className="h-4 w-4 mr-1" />
              Clear all
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-2">Categories</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  checked={activeFilters.category === category.id.toString()}
                  onChange={() => handleCategoryChange(category.id)}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="text-sm text-gray-600">Min</label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                  className="form-input block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-600">Max</label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                  className="form-input block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="9999"
                  min="0"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handlePriceChange}
            className="mt-3 w-full bg-gray-300 hover:bg-gray-500 text-gray-800 hover:text-white py-2 rounded-md text-sm transition-colors duration-200"
          >
            Apply Price
          </button>
        </div>

        {/* Availability */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Availability</h4>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={activeFilters.in_stock === "true"}
              onChange={() =>
                onFilterChange({
                  ...activeFilters,
                  in_stock:
                    activeFilters.in_stock === "true" ? undefined : "true",
                })
              }
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700">In Stock Only</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
