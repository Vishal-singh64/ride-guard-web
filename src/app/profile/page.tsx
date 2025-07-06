'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Mail, Flag, Coins, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppRoutes } from '@/constants/appRoutes';

export default function ProfilePage() {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push(AppRoutes.LOGIN);
        }
    }, [loading, isAuthenticated, router]);
    
    const getInitials = (name = '') => {
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }

    if (loading || !user) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <Card className="shadow-lg mb-8">
                    <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                        <Avatar className="h-28 w-28 border-4 border-primary">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                            <AvatarFallback className="text-4xl">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="text-center md:text-left">
                            <h1 className="font-headline text-4xl font-bold">{user.name}</h1>
                            <p className="text-muted-foreground text-lg mt-1 flex items-center gap-2 justify-center md:justify-start">
                                <Mail className="h-5 w-5" />
                                {user.email}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <Card className="shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Frauds Reported</CardTitle>
                            <Flag className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{user.fraudsReported}</div>
                            <p className="text-xs text-muted-foreground">reports submitted to help the community</p>
                        </CardContent>
                    </Card>
                     <Card className="shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Coins Earned</CardTitle>
                            <Coins className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{user.coins}</div>
                            <p className="text-xs text-muted-foreground">for your valuable contributions</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
