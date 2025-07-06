'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { post } from '@/services/apiService';
import { ApiRoutes } from '@/constants/apiRoutes';
import { useState } from 'react';

const reportSchema = z.object({
    reporterPhoneNumber: z.string().min(10, 'A valid phone number is required.').max(15),
    reportedPhoneNumber: z.string().min(10, 'A valid phone number is required.').max(15),
    reportText: z.string().min(20, 'Please provide a detailed report of at least 20 characters.').max(1000),
});

type ReportFormValues = z.infer<typeof reportSchema>;

type SubmissionStatus = {
    success: boolean;
    message: string;
} | null;

export function FraudReportForm() {
    const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(null);
    const { toast } = useToast();
    const form = useForm<ReportFormValues>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            reporterPhoneNumber: '',
            reportedPhoneNumber: '',
            reportText: '',
        },
    });

    const { formState: { isSubmitting } } = form;

    const onSubmit: SubmitHandler<ReportFormValues> = async (data) => {
        setSubmissionStatus(null);
        try {
            const result = await post<{ success: boolean; message: string }>(ApiRoutes.SUBMIT_REPORT, data);
            setSubmissionStatus(result);
            if (result.success) {
                toast({
                    title: "Report Submitted",
                    description: result.message,
                });
                form.reset();
            } else {
                 toast({
                    variant: "destructive",
                    title: "Submission Failed",
                    description: result.message,
                });
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || "An unexpected error occurred.";
            setSubmissionStatus({ success: false, message });
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: message,
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="reporterPhoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold">Your Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reportedPhoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold">Fraudulent Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="+1 (555) 765-4321" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reportText"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold">Description of Incident</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Describe what happened. Please provide as much detail as possible." {...field} />
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
                        'Submit Report'
                    )}
                </Button>

                {submissionStatus?.success && (
                    <Alert className="mt-6">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle className="font-headline">Success</AlertTitle>
                        <AlertDescription>
                           {submissionStatus.message}
                        </AlertDescription>
                    </Alert>
                )}
            </form>
        </Form>
    );
}
