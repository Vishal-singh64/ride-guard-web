'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Menu, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/ui/sheet';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from '@/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import React from 'react';
import LanguageSwitcher from './language-switcher';
import { AppRoutes } from '@/constants/appRoutes';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';

const navLinks = [
  { href: AppRoutes.HOME, label: 'Check Number' },
  { href: AppRoutes.REPORT_FRAUD, label: 'Report Fraud' },
  { href: AppRoutes.ABOUT, label: 'About Us' },
  { href: AppRoutes.DOWNLOAD, label: 'Download' },
];

export function Header() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const getInitials = (name = '') => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <ShieldCheck className="h-7 w-7 text-primary" />
            <span className="font-bold font-headline text-xl">Ride Guard</span>
          </Link>
        </div>
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="hidden md:flex items-center space-x-2">
             <LanguageSwitcher />
            {isAuthenticated && user ? (
               <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={AppRoutes.PROFILE}>
                                <UserIcon className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
              <>
                 <Button asChild variant="ghost">
                    <Link href={AppRoutes.LOGIN}>Login</Link>
                 </Button>
                 <Button asChild>
                    <Link href={AppRoutes.REGISTER}>Register</Link>
                 </Button>
              </>
            )}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
               <div className="flex h-full flex-col">
                <div className="p-4 border-b">
                    <Link href="/" className="flex items-center space-x-2">
                      <ShieldCheck className="h-7 w-7 text-primary" />
                      <span className="font-bold font-headline text-xl">Ride Guard</span>
                    </Link>
                </div>
                <nav className="flex flex-col p-4 space-y-1 flex-grow">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            'text-lg rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground',
                            pathname === link.href ? 'bg-accent text-accent-foreground' : 'text-foreground'
                          )}
                        >
                          {link.label}
                        </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="border-t p-4">
                  {isAuthenticated && user ? (
                    <div className="flex flex-col space-y-4">
                        <SheetClose asChild>
                            <Link href={AppRoutes.PROFILE} className="flex items-center gap-3 rounded-md p-2 hover:bg-accent">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">View Profile</p>
                                </div>
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Button variant="outline" className="w-full" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Log Out
                            </Button>
                        </SheetClose>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                        <SheetClose asChild>
                          <Button asChild variant="outline" className="w-full">
                              <Link href={AppRoutes.LOGIN}>Login</Link>
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                           <Button asChild className="w-full">
                            <Link href={AppRoutes.REGISTER}>Register</Link>
                          </Button>
                        </SheetClose>
                    </div>
                  )}
                </div>
                 <div className="border-t p-4">
                  <LanguageSwitcher />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
