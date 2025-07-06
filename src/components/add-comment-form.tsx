'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/ui/button';
import { Textarea } from '@/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { useToast } from "@/hooks/use-toast";
import { post } from '@/services/apiService';
import { ApiRoutes } from '@/constants/apiRoutes';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

const commentSchema = z.object({
  comment: z.string().min(10, 'Comment must be at least 10 characters long.').max(500),
});

type CommentFormValues = z.infer<typeof commentSchema>;

interface AddCommentFormProps {
    phoneNumber: string;
    onCommentAdded: (comment: any) => void;
}

export function AddCommentForm({ phoneNumber, onCommentAdded }: AddCommentFormProps) {
    const { toast } = useToast();
    const { user } = useAuth();
    
    const form = useForm<CommentFormValues>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            comment: '',
        },
    });
    
    const { formState: { isSubmitting } } = form;

    const onSubmit: SubmitHandler<CommentFormValues> = async (data) => {
        if (!user) {
            toast({
                variant: "destructive",
                title: "Authentication Error",
                description: "You must be logged in to comment.",
            });
            return;
        }

        try {
            const payload = {
                phoneNumber,
                comment: data.comment,
                author: user.email,
            };
            const result = await post<{ success: boolean; message: string }>(ApiRoutes.ADD_COMMENT, payload);
            
            if (result.success) {
                toast({
                    title: "Comment Added",
                    description: "Thank you for contributing to the community!",
                });
                onCommentAdded({
                    id: Date.now(), // temporary ID for UI update
                    text: data.comment,
                    author: user.email,
                    authorName: user.name,
                    date: new Date().toISOString(),
                });
                form.reset();
            } else {
                 toast({
                    variant: "destructive",
                    title: "Submission Failed",
                    description: result.message || "Could not add your comment.",
                });
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || "An unexpected error occurred.";
            toast({
                variant: "destructive",
                title: "Error",
                description: message,
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="sr-only">Your Report</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Share details of your experience with this number..." {...field} rows={4} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                     {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Your Report'
                    )}
                </Button>
            </form>
        </Form>
    );
}
