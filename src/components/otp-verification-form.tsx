'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/ui/input-otp';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { post } from '@/services/apiService';
import { ApiRoutes } from '@/constants/apiRoutes';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppRoutes } from '@/constants/appRoutes';
import { useEffect } from 'react';

const otpSchema = z.object({
    otp: z.string().min(6, 'Your one-time password must be 6 characters.'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export function OtpVerificationForm() {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    useEffect(() => {
        if (!email) {
            toast({
                variant: "destructive",
                title: "Missing Information",
                description: "Email address not found. Please try signing up again.",
            });
            router.replace(AppRoutes.REGISTER);
        }
    }, [email, router, toast]);

    const form = useForm<OtpFormValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: '',
        },
    });

    const { formState: { isSubmitting } } = form;

    const onSubmit: SubmitHandler<OtpFormValues> = async (data) => {
        if (!email) return;

        try {
            const result = await post<{ success: boolean; message: string }>(ApiRoutes.VERIFY_OTP, { email, otp: data.otp });
            
            if (result.success) {
                toast({
                    title: "Verification Successful",
                    description: "Your account has been verified. You can now log in.",
                });
                router.push(AppRoutes.LOGIN);
            } else {
                 toast({
                    variant: "destructive",
                    title: "Verification Failed",
                    description: result.message || "Invalid OTP. Please try again.",
                });
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || "An unexpected error occurred.";
            toast({
                variant: "destructive",
                title: "Verification Failed",
                description: message,
            });
        }
    };
    
    const onResendOtp = () => {
        // In a real app, this would trigger an API call to resend the OTP.
        // For now, we'll just show a toast.
        toast({
            title: "OTP Resent",
            description: "A new OTP has been sent to your email address (mocked).",
        });
    }

    if (!email) {
        return null; // or a loading/error state
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="sr-only">One-Time Password</FormLabel>
                            <FormControl>
                                <div className="flex justify-center">
                                    <InputOTP maxLength={6} {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        'Verify Account'
                    )}
                </Button>

                <div className="text-center text-sm">
                    Didn&apos;t receive the code?{" "}
                    <Button variant="link" type="button" onClick={onResendOtp} className="p-0 h-auto">
                        Resend
                    </Button>
                </div>
            </form>
        </Form>
    );
}
