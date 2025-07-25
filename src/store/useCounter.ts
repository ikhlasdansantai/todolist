import { create } from "zustand";

interface UploadStoreProps {
  count: number;
  increment: () => void;
}

export const useCounter = create<UploadStoreProps>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
