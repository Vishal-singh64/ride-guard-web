import { LoginForm } from '@/components/login-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/card';
import Link from 'next/link';
import { AppRoutes } from '@/constants/appRoutes';

export default function LoginPage() {
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in flex justify-center items-center">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-2xl md:text-3xl">Welcome Back</CardTitle>
                    <CardDescription>
                        Sign in to your Ride Guard account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link href={AppRoutes.REGISTER} className="font-medium text-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
