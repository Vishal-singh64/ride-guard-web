import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Apple, Smartphone } from 'lucide-react';

export default function DownloadPage() {
    return (
        <div className="bg-background animate-fade-in">
            <section className="bg-secondary/50 py-20 md:py-32">
                <div className="container mx-auto text-center px-4">
                <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">Get Ride Guard on the Go</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                    Download our mobile app for real-time fraud alerts, offline access to the database, and one-tap reporting.
                </p>
                </div>
            </section>
            <section className="container mx-auto px-4 -mt-16 pb-20">
                <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-8 md:p-12 lg:flex lg:items-center lg:justify-between max-w-4xl mx-auto">
                        <div className="lg:w-0 lg:flex-1">
                            <h2 className="text-3xl font-headline font-bold tracking-tight">Available Now</h2>
                            <p className="mt-4 max-w-3xl text-lg text-primary-foreground/80">
                                Click the buttons below to download the app for your device.
                            </p>
                        </div>
                        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                            <div className="inline-flex rounded-md shadow">
                                <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                                    <Link href="#" aria-label="Download on the App Store">
                                        <Apple className="mr-2 h-6 w-6"/>
                                        App Store
                                    </Link>
                                </Button>
                            </div>
                            <div className="ml-4 inline-flex rounded-md shadow">
                                <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                                    <Link href="#" aria-label="Get it on Google Play">
                                        <Smartphone className="mr-2 h-6 w-6"/>
                                        Google Play
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
            </section>
        </div>
    );
}
