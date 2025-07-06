import { RegisterForm } from '@/components/register-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/card';
import Link from 'next/link';
import { AppRoutes } from '@/constants/appRoutes';

export default function RegisterPage() {
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in flex justify-center items-center">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl">Create an Account</CardTitle>
                    <CardDescription>
                       Join Ride Guard to help our community stay safe.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm />
                     <p className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href={AppRoutes.LOGIN} className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
