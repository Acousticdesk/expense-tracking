import { ReactNode } from "react";
import { TabBar } from "./TabBar";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {children}

      <TabBar />
    </div>
  );
}
