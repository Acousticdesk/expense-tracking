import { Link } from "react-router-dom";
import { ChartBarStacked, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface TabBarProps {
    className?: string;
}

export function TabBar({ className }: TabBarProps) {
  const navItems = [
    ["/", <Plus />],
    ["/", <ChartBarStacked />],
  ] as const;
  return (
    <div className={cn("flex justify-around border-t border-t-slate-950 py-2", className)}>
      {navItems.map(([path, icon]) => (
        <Link to={path}>
          <Button>{icon}</Button>
        </Link>
      ))}
    </div>
  );
}
