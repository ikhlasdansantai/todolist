"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const getToken = localStorage.getItem("token");
  if (!getToken) router.push("/login");

  return <main>{children}</main>;
}
