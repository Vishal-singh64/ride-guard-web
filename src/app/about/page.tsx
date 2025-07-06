import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Handshake } from 'lucide-react';

export default function AboutPage() {
    const features = [
        {
            icon: <Shield className="h-10 w-10 text-primary" />,
            title: 'Our Mission',
            description: 'To create a safer environment for cab drivers by building a community-driven fraud prevention platform. We believe in the power of shared information to combat scams and protect livelihoods.',
        },
        {
            icon: <Users className="h-10 w-10 text-primary" />,
            title: 'Community-Powered',
            description: 'CabSafe is powered by you. Every report submitted helps build a comprehensive database of fraudulent numbers, making the entire driver community more resilient against scams.',
        },
        {
            icon: <Handshake className="h-10 w-10 text-primary" />,
            title: 'Building Trust',
            description: 'We are committed to providing a reliable and easy-to-use service. Our advanced AI helps verify reports to ensure the data you see is trustworthy, helping you make informed decisions.',
        },
    ];

    return (
        <div className="bg-background animate-fade-in">
            <div className="container mx-auto max-w-7xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        A Safer Ride for Everyone
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-muted-foreground">
                        Empowering cab drivers with the information they need to stay safe from fraud and build a more secure community.
                    </p>
                </div>

                <div className="mt-20">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                        {features.map((feature) => (
                            <Card key={feature.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="mt-6 font-headline text-2xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
