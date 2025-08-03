"use client";
import { Progress, Slider } from "antd";
import "antd/dist/reset.css";
import { useFilters } from "@/context/FiltersContext";
import { useEffect, useState } from "react";

export default function Filters({ allProducts }) {
  const { filters, setFilters } = useFilters();
  const brands = [...new Set(allProducts.map((p) => p.brand))];
  const categories = [...new Set(allProducts.map((p) => p.category))];
  const [searchValue, setSearchValue] = useState(filters.search);
  const [percent, setPercent] = useState(0);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    setPercent(20);
    setLoading(true);
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchValue,
      }));
      setPercent(100);
      const loadingTimer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(loadingTimer);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleCategoryChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setFilters((prev) => {
      const newCategories = [...prev.category];
      selected.forEach((cat) => {
        if (!newCategories.includes(cat)) {
          newCategories.push(cat);
        }
      });
      return {
        ...prev,
        category: newCategories,
      };
    });
  };

  const handleBrandChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setFilters((prev) => {
      const newBrands = [...prev.brand];
      selected.forEach((brand) => {
        if (!newBrands.includes(brand)) {
          newBrands.push(brand);
        }
      });
      return {
        ...prev,
        brand: newBrands,
      };
    });
  };

  const prices = allProducts.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  const onPriceChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
    }));
  };

  const removeBrand = (brandToRemove) => {
    setFilters((prev) => ({
      ...prev,
      brand: prev.brand.filter((b) => b !== brandToRemove),
    }));
  };

  return (
    <div className="flex flex-col gap-4 p-4 rounded shadow w-full max-w-sm">
      <label className="text-sm font-bold">Categories</label>
      <select
        multiple
        value={filters.category}
        onChange={handleCategoryChange}
        className="bg-black text-white h-32 rounded-2xl p-2"
      >
        {categories.map((c, i) => (
          <option key={`${c}-${i}`} value={c}>
            {c}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap gap-2">
        {filters.category.map((c) => (
          <div
            key={c}
            className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full flex items-center"
          >
            {c}
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  category: prev.category.filter((cat) => cat !== c),
                }))
              }
              className="ml-2 text-red-600 font-bold hover:text-red-800"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <label className="text-sm font-bold">Brands</label>
      <select
        multiple
        value={filters.brand}
        onChange={handleBrandChange}
        className="bg-black text-white h-32 rounded-2xl p-2"
      >
        {brands.map((b, i) => (
          <option key={`${b}-${i}`} value={b}>
            {b}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap gap-2">
        {filters.brand.map((b) => (
          <div
            key={b}
            className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center"
          >
            {b}
            <button
              onClick={() => removeBrand(b)}
              className="ml-2 text-red-600 font-bold hover:text-red-800"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input
        type="search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="search..."
        className="p-2 border rounded-2xl"
      />
      <label>
        {Loading ? (
          <Progress
            percent={percent}
            size="small"
            status="active"
            strokeColor="white"
            format={(percent) => (
              <span style={{ color: "white" }}>{percent}%</span>
            )}
          />
        ) : null}
        <input
          className="mr-2"
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              inStockOnly: e.target.checked,
            }))
          }
        />
        In Stock only
      </label>
      <label className="font-bold pb-5 ">Price Range</label>
      <Slider
        range
        min={min}
        max={max}
        defaultValue={[filters.minPrice, filters.maxPrice]}
        value={[filters.minPrice, filters.maxPrice]}
        onChange={onPriceChange}
        tooltip={{ open: true }}
        step={1}
      />
      <p className="pt-4">
        Price: {filters.minPrice} $ - {filters.maxPrice} $
      </p>
    </div>
  );
}
