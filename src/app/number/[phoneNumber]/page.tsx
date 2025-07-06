'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card';
import {
  AlertTriangle,
  MessageSquare,
  DollarSign,
  Hash,
  Loader2,
  UserPlus,
  User,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import { AddCommentForm } from '@/components/add-comment-form';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
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

interface UserDetails {
  name: string;
  location: string;
  phoneNumber: string;
  email: string;
  simProvider: string;
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
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [details, setDetails] = useState<NumberDetails | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof phoneNumber === 'string') {
      const fetchDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/number-details/${phoneNumber}`);
          if (!response.ok) throw new Error('Failed to fetch number details');
          const data = await response.json();

          // Mock user data for demo purposes — replace this with real API data when available
          setUserDetails({
            name: 'John Doe',
            location: 'Mumbai, India',
            phoneNumber: data.phoneNumber,
            email: 'johndoe@example.com',
            simProvider: 'Airtel',
          });

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
  };

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
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      {/* Fraud Status Card */}
      <div className={`shadow-lg rounded-lg ${isFraudulent ? 'border border-destructive' : 'border border-accent'} mb-8`}>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle className="font-bold text-2xl md:text-3xl flex items-center gap-3">
                {isFraudulent ? (
                  <>
                    <AlertTriangle className="text-destructive h-8 w-8" />
                    <span>{details.phoneNumber}</span>
                  </>
                ) : (
                  <>
                    <Hash className="text-primary h-8 w-8" />
                    <span>{details.phoneNumber}</span>
                  </>
                )}
              </CardTitle>
              <CardDescription className="mt-2 text-base md:text-lg">
                {isFraudulent
                  ? 'This number has been reported for fraudulent activities.'
                  : 'No fraud reports for this number.'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <div>

        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 mb-8">
            <Card className="bg-secondary/50 p-4">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-xl font-bold">{details.reportCount}</span>
              </div>
            </Card>
            <Card className="bg-secondary/50 p-4">
              <CardTitle className="text-sm font-medium">Fraud Amount</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-xl font-bold">{details.totalFraudAmount.toLocaleString()}</span>
              </div>
            </Card>
          </div>
        </CardContent>
        
        {/* User Details Card */}
{/* User Details Card */}
{userDetails && (
  <Card className="mb-8 shadow-md border border-gray-200 m-6">
    <CardHeader className="bg-primary/5 rounded-t-md">
      <CardTitle className="text-xl font-semibold text-primary flex items-center gap-3">
        <User className="h-6 w-6" />
        <span>User Information</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Centered Avatar with Name */}
        <div className="flex flex-col items-center text-center md:col-span-2">
          <Avatar className="h-20 w-20 mb-3">
            <AvatarImage
              src={` https://api.dicebear.com/7.x/initials/svg?seed=${userDetails.name}`}
              alt={userDetails.name}
            />
            <AvatarFallback>{getInitials(userDetails.name)}</AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-semibold">{userDetails.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">User Profile</p>
        </div>

        {/* Other fields */}
        <div className="flex items-start gap-3">
          <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium">{userDetails.location}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="mt-1 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Phone Number</p>
            <p className="font-medium">{userDetails.phoneNumber}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="mt-1 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{userDetails.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="mt-1 h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">SIM Provider</p>
            <p className="font-medium">{userDetails.simProvider}</p>
          </div>
        </div>

      </div>
    </CardContent>
  </Card>
)}
        </div>
      </div>

      

      {/* Comments Section */}
      <section className="space-y-8">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="text-primary" /> Community Reports
          </h3>
          <div className="space-y-4">
            {details.comments.length > 0 ? (
              details.comments.map((comment) => (
                <Card key={comment.id} className="bg-white shadow-sm">
                  <CardContent className="p-4 flex gap-4 items-start">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.authorName}`}
                        alt={comment.authorName}
                      />
                      <AvatarFallback>{getInitials(comment.authorName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{comment.authorName}</p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                        </p>
                      </div>
                      <p className="text-gray-700 mt-1">{comment.text}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500 italic">No reports yet. Be the first to share your experience!</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl md:text-2xl font-semibold mb-4">Add Your Report</h3>
          {isAuthenticated ? (
            <AddCommentForm phoneNumber={details.phoneNumber} onCommentAdded={handleCommentAdded} />
          ) : (
            <Card className="bg-secondary/30 text-center p-6">
              <UserPlus className="h-12 w-12 mx-auto text-gray-400" />
              <CardTitle className="mt-4 text-xl font-semibold">Join the Conversation</CardTitle>
              <CardDescription className="mt-2 text-gray-600">
                You need to be logged in to add a report and help the community.
              </CardDescription>
              <Button asChild className="mt-4">
                <Link href={AppRoutes.LOGIN}>Login to Report</Link>
              </Button>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}