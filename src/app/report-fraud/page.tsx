import { FraudReportForm } from '@/components/fraud-report-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/card';

export default function ReportFraudPage() {
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Report a Fraudulent Number</CardTitle>
                    <CardDescription>
                        Help protect the community by reporting suspicious numbers. Your report will be analyzed by our AI to ensure accuracy and prevent abuse.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FraudReportForm />
                </CardContent>
            </Card>
        </div>
    );
}
