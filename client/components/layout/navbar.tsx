"use client";

import Link from "next/link";
// import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { logoutUser } from "@/firebase/auth";
import { Button } from "../ui/button";
import { LogOut, Moon, Sun, User } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

export function Navbar() {
  // const { setTheme } = useTheme();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/feed" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-md outline-2 outline-transparent group-hover:outline-neutral-600 outline-offset-2 transition"
            />
            <span className="text-xl font-bold group-hover:text-neutral-600 transition">
              Twitteritto Bandito
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => console.log("Set theme to light")}
              >
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Set theme to dark")}
              >
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Set theme to system")}
              >
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profilePhotoUrl} alt="User" />
                  <AvatarFallback>
                    {user?.username?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.username}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
