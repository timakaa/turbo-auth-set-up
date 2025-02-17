"use client";

import AuthHeader from "@/components/AuthHeader";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import React from "react";

const noHeaderPaths = ["/signin", "/signup"];

const Providers = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const showHeader = !noHeaderPaths.includes(pathname);
  return (
    <>
      {showHeader ? <Header /> : <AuthHeader />}
      {children}
    </>
  );
};

export default Providers;
