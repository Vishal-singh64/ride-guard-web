'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertTriangle, CheckCircle2, Phone, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, 'Please enter a valid phone number with at least 10 digits.'),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;

type SearchResult = {
  isFraud: boolean;
  number: string;
} | null;

interface HomePageClientProps {
  checkNumberAction: (phoneNumber: string) => Promise<{ isFraud: boolean }>;
}

export function HomePageClient({ checkNumberAction }: HomePageClientProps) {
  const [searchResult, setSearchResult] = useState<SearchResult>(null);
  const { formState: { isSubmitting }, ...form } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber: '' },
  });

  const onSubmit: SubmitHandler<PhoneFormValues> = async (data) => {
    setSearchResult(null);
    try {
      const result = await checkNumberAction(data.phoneNumber);
      setSearchResult({ ...result, number: data.phoneNumber });
    } catch (error) {
      console.error('Search failed:', error);
      // Optionally, show a toast notification for the error
    }
  };

  return (
    <div className="w-full">
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/20 bg-[length:200%_200%] animate-background-pan" />
        <div className="container mx-auto text-center px-4 relative z-10">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">Protect Your Ride</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            Instantly check phone numbers for reported fraud. Keep our driver community safe, one check at a time.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-16 relative z-10">
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Phone className="text-primary" />
              Check a Phone Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number..." {...field} className="h-12 text-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    'Check Number'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {searchResult && (
          <div className="mt-8 max-w-2xl mx-auto animate-fade-in">
            {searchResult.isFraud ? (
              <Card className="bg-destructive/10 border-destructive text-destructive-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-destructive">
                    <AlertTriangle size={28} />
                    <span className="font-headline text-2xl">Fraud Alert!</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">
                    This number, <strong>{searchResult.number}</strong>, has been reported for fraudulent activity. Do not trust this number.
                  </p>
                  <Button asChild variant="destructive" className="mt-4">
                    <Link href="/report-fraud">Report Another Number</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-accent/10 border-accent text-accent-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-700 dark:text-accent-foreground">
                    <CheckCircle2 size={28} />
                    <span className="font-headline text-2xl">Number Looks Safe</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-foreground">
                  <p className="text-lg">
                    No fraud has been registered against <strong>{searchResult.number}</strong>.
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    If you've had a suspicious interaction, help the community by reporting it.
                  </p>
                  <Button asChild variant="default" className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/report-fraud">Report Fraud</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
