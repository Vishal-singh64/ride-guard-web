'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card';
import { AlertTriangle, MessageSquare, DollarSign, Hash, Loader2, UserPlus } from 'lucide-react';
import { AddCommentForm } from '@/components/add-comment-form';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/ui/button';
import Link from 'next/link';
import { AppRoutes } from '@/constants/appRoutes';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';

interface Comment {
    id: number;
    author: string;
    authorName: string;
    text: string;
    date: string;
}

interface NumberDetails {
    phoneNumber: string;
    reportCount: number;
    totalFraudAmount: number;
    comments: Comment[];
}

export default function NumberDetailsPage() {
    const params = useParams();
    const { phoneNumber } = params;
    const { isAuthenticated } = useAuth();

    const [details, setDetails] = useState<NumberDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof phoneNumber === 'string') {
            const fetchDetails = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await fetch(`/api/number-details/${phoneNumber}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch number details');
                    }
                    const data = await response.json();
                    setDetails(data);
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred');
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        }
    }, [phoneNumber]);

    const handleCommentAdded = (newComment: Comment) => {
        if (details) {
            setDetails({
                ...details,
                comments: [...details.comments, newComment],
                reportCount: details.reportCount + 1,
            });
        }
    };

    const getInitials = (name = '') => {
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }


    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-20 text-destructive">{error}</div>;
    }

    if (!details) {
        return <div className="text-center py-20 text-muted-foreground">No details found for this number.</div>;
    }

    const isFraudulent = details.reportCount > 0;

    return (
        <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <Card className={`shadow-lg ${isFraudulent ? 'border-destructive' : 'border-accent'}`}>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                             <CardTitle className="font-headline text-4xl flex items-center gap-3">
                                {isFraudulent ? 
                                    <AlertTriangle className="text-destructive h-8 w-8" /> : 
                                    <Hash className="text-primary h-8 w-8" />
                                }
                                {details.phoneNumber}
                            </CardTitle>
                            <CardDescription className="mt-2 text-lg">
                                {isFraudulent ? "This number has been reported for fraudulent activities." : "No fraud reports for this number."}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Card className="bg-secondary/50">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                                <Hash className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{details.reportCount}</div>
                            </CardContent>
                        </Card>
                         <Card className="bg-secondary/50">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Reported Fraud Amount</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${details.totalFraudAmount.toFixed(2)}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-headline font-semibold mb-4 flex items-center gap-2">
                                <MessageSquare className="text-primary" /> Community Reports
                            </h3>
                            <div className="space-y-4">
                                {details.comments.length > 0 ? (
                                    details.comments.map((comment) => (
                                        <Card key={comment.id} className="bg-background">
                                            <CardContent className="p-4 flex gap-4 items-start">
                                                <Avatar>
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.authorName}`} alt={comment.authorName} />
                                                    <AvatarFallback>{getInitials(comment.authorName)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-foreground">{comment.authorName}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                                                        </p>
                                                    </div>
                                                    <p className="text-foreground mt-1">{comment.text}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground">No comments yet. Be the first to add one!</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-headline font-semibold mb-4">Add Your Report</h3>
                            {isAuthenticated ? (
                                <AddCommentForm phoneNumber={details.phoneNumber} onCommentAdded={handleCommentAdded} />
                            ) : (
                                <Card className="bg-secondary/30 text-center p-6">
                                     <UserPlus className="h-12 w-12 mx-auto text-muted-foreground" />
                                    <CardTitle className="mt-4 text-xl font-headline">Join the Conversation</CardTitle>
                                    <CardDescription className="mt-2">
                                        You need to be logged in to add a report and help the community.
                                    </CardDescription>
                                    <Button asChild className="mt-4">
                                        <Link href={AppRoutes.LOGIN}>Login to Report</Link>
                                    </Button>
                                </Card>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
