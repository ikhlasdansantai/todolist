"use client";
import { useEffect, useState } from "react";


export function useDebounce(inputValue: string, delay = 200) {
  const [inputDebounce, setInputDebunce] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setInputDebunce(inputValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [inputValue, delay]);

  return inputDebounce;
}
