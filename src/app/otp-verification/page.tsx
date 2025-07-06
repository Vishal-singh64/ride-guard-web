import { OtpVerificationForm } from '@/components/otp-verification-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/card';
import { Suspense } from 'react';

function OtpVerificationContent() {
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in flex justify-center items-center">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl">Check your email</CardTitle>
                    <CardDescription>
                       We&apos;ve sent a 6-digit verification code to your email address.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <OtpVerificationForm />
                </CardContent>
            </Card>
        </div>
    )
}


export default function OtpVerificationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OtpVerificationContent />
        </Suspense>
    );
}
