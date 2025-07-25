"use client";

import { useDebounce } from "@/lib/useDebounce";
import { useEffect, useState } from "react";

export default function DebouncePage() {
  const [search, setSearch] = useState<string>("");
  const [data, setData] = useState<any>([]);
  const debounceValue = useDebounce(search, 200);

  async function someApi() {
    let url = "https://dummyjson.com/products";

    if (search) {
      url = `https://dummyjson.com/products/search?q=${debounceValue}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setData(data.products);
    console.log(data.products);
  }

  useEffect(() => {
    someApi();
  }, []);

  if (!data) return <p>No data loaded!</p>;

  return (
    <>
      <input type="text" placeholder="username..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <p>Your search: {search}</p>

      <div>

      </div>
    </>
  );
}
