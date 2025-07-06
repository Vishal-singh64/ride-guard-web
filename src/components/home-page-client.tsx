'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { AlertTriangle, CheckCircle2, Phone, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { post } from '@/services/apiService';
import { ApiRoutes } from '@/constants/apiRoutes';
import { AppRoutes } from '@/constants/appRoutes';

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, 'Please enter a valid phone number with at least 10 digits.'),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;

type SearchResult = {
  isFraud: boolean;
  number: string;
} | null;

export function HomePageClient() {
  const [searchResult, setSearchResult] = useState<SearchResult>(null);
  const { formState: { isSubmitting }, ...form } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber: '' },
  });

  const onSubmit: SubmitHandler<PhoneFormValues> = async (data) => {
    setSearchResult(null);
    try {
      const result = await post<{ isFraud: boolean, number: string }>(ApiRoutes.CHECK_NUMBER, { phoneNumber: data.phoneNumber });
      setSearchResult(result);
    } catch (error) {
      console.error('Search failed:', error);
      // Optionally, show a toast notification for the error
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow px-4 text-center">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-center gap-3 animate-fade-in">
          <ShieldCheck className="h-12 w-12 text-primary md:h-16 md:w-16" />
          <h1 className="font-headline text-5xl font-bold text-foreground md:text-6xl">
            Ride Guard
          </h1>
        </div>
        
        <div className="w-full max-w-lg mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="sr-only">Phone Number</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    placeholder="Enter phone number..." 
                                    {...field} 
                                    className="h-14 text-lg pl-12 w-full rounded-full shadow-lg focus-visible:ring-primary focus-visible:ring-2" 
                                />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" size="lg" className="h-12 px-8 text-lg rounded-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Checking
                        </>
                    ) : (
                        'Search'
                    )}
                    </Button>
                </form>
            </Form>
        </div>

        {searchResult && (
            <div className="mt-8 w-full max-w-lg mx-auto animate-fade-in">
                <Card className="shadow-lg text-left">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                        {searchResult.isFraud ? <AlertTriangle className="text-destructive"/> : <CheckCircle2 className="text-accent"/>}
                        Result for {searchResult.number}
                        </CardTitle>
                        <CardDescription>
                        {searchResult.isFraud ? "This number has reports of fraudulent activity." : "No fraud reports found for this number."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Click the button below to see a detailed report, including community comments.
                        </p>
                        <Button asChild className="mt-4 w-full sm:w-auto">
                            <Link href={AppRoutes.NUMBER_DETAILS(searchResult.number)}>
                                View Detailed Report
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )}
      </div>
    </div>
  );
}
