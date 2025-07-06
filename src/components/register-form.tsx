'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { post } from '@/services/apiService';
import { ApiRoutes } from '@/constants/apiRoutes';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/constants/appRoutes';

const registerSchema = z.object({
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const { formState: { isSubmitting } } = form;

    const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
        try {
            const result = await post<{ success: boolean; message: string }>(ApiRoutes.REGISTER, { email: data.email, password: data.password });
            if (result.success) {
                toast({
                    title: "Registration Successful",
                    description: "You can now log in with your new account.",
                });
                router.push(AppRoutes.LOGIN);
            } else {
                 toast({
                    variant: "destructive",
                    title: "Registration Failed",
                    description: result.message,
                });
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || "An unexpected error occurred.";
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: message,
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold">Email Address</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold">Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold">Confirm Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                        </>
                    ) : (
                        'Sign Up'
                    )}
                </Button>
            </form>
        </Form>
    );
}
