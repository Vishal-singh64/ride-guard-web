'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { Loader2, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { post } from '@/services/apiService';
import { ApiRoutes } from '@/constants/apiRoutes';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/constants/appRoutes';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string(),
    profileImage: z.any().optional(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const { toast } = useToast();
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const { formState: { isSubmitting }, control } = form;

    const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
        try {
            const payload = { 
                name: data.name,
                email: data.email,
                password: data.password
            };
            const result = await post<{ success: boolean; message: string }>(ApiRoutes.REGISTER, payload);
            
            if (result.success) {
                toast({
                    title: "OTP Sent",
                    description: result.message,
                });
                router.push(`${AppRoutes.OTP_VERIFICATION}?email=${encodeURIComponent(data.email)}`);
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
                    control={control}
                    name="profileImage"
                    render={({ field }) => (
                        <FormItem className="flex flex-col items-center">
                            <Avatar className="h-24 w-24 mb-2">
                                <AvatarImage src={imagePreview ?? undefined} alt="Profile preview" />
                                <AvatarFallback>
                                    <User className="h-12 w-12" />
                                </AvatarFallback>
                            </Avatar>
                            <FormLabel htmlFor="profileImage" className="font-semibold cursor-pointer text-primary hover:underline">
                                Upload Profile Picture
                            </FormLabel>
                            <FormControl>
                                <Input 
                                    type="file" 
                                    id="profileImage"
                                    className="sr-only" 
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            field.onChange(file);
                                            setImagePreview(URL.createObjectURL(file));
                                        } else {
                                            field.onChange(null);
                                            setImagePreview(null);
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold">Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={control}
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
                    control={control}
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
                    control={control}
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
