'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/constants/appRoutes';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const { toast } = useToast();
    const { login } = useAuth();
    const router = useRouter();
    
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { formState: { isSubmitting } } = form;

    const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
        try {
            await login(data.email, data.password);
            toast({
                title: "Login Successful",
                description: "Welcome back!",
            });
            router.push(AppRoutes.HOME);
        } catch (error: any) {
            const message = error?.message || "Invalid email or password.";
            toast({
                variant: "destructive",
                title: "Login Failed",
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

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing In...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </Button>
            </form>
        </Form>
    );
}
