'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import React from 'react';
import LanguageSwitcher from './language-switcher';
import { AppRoutes } from '@/constants/appRoutes';

const navLinks = [
  { href: AppRoutes.HOME, label: 'Check Number' },
  { href: AppRoutes.REPORT_FRAUD, label: 'Report Fraud' },
  { href: AppRoutes.ABOUT, label: 'About Us' },
  { href: AppRoutes.DOWNLOAD, label: 'Download' },
];

export function Header() {
  const pathname = usePathname();

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
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="hidden md:flex">
            <LanguageSwitcher />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col p-4">
                <Link href="/" className="mb-8 flex items-center space-x-2">
                  <ShieldCheck className="h-7 w-7 text-primary" />
                  <span className="font-bold font-headline text-xl">Ride Guard</span>
                </Link>
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            'text-lg transition-colors hover:text-primary',
                            pathname === link.href ? 'text-primary' : 'text-foreground'
                          )}
                        >
                          {link.label}
                        </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-8 border-t pt-4">
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
