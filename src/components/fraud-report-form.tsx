'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { submitFraudReport } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Report...
                </>
            ) : (
                'Submit Report'
            )}
        </Button>
    );
}

export function FraudReportForm() {
    const initialState = null;
    const [state, formAction] = useFormState(submitFraudReport, initialState);
    const { toast } = useToast();

    useEffect(() => {
        if(state?.success === true) {
            toast({
                title: "Report Submitted",
                description: state.message,
            });
        } else if (state?.success === false && !state.errors) {
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: state.message,
            });
        }
    }, [state, toast]);

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="reporterPhoneNumber" className="font-semibold">Your Phone Number</Label>
                <Input id="reporterPhoneNumber" name="reporterPhoneNumber" placeholder="+1 (555) 123-4567" required />
                 {state?.errors?.reporterPhoneNumber && <p className="text-sm text-destructive">{state.errors.reporterPhoneNumber[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="reportedPhoneNumber" className="font-semibold">Fraudulent Phone Number</Label>
                <Input id="reportedPhoneNumber" name="reportedPhoneNumber" placeholder="+1 (555) 765-4321" required />
                {state?.errors?.reportedPhoneNumber && <p className="text-sm text-destructive">{state.errors.reportedPhoneNumber[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="reportText" className="font-semibold">Description of Incident</Label>
                <Textarea id="reportText" name="reportText" placeholder="Describe what happened. Please provide as much detail as possible." required minLength={20} />
                {state?.errors?.reportText && <p className="text-sm text-destructive">{state.errors.reportText[0]}</p>}
            </div>
            
            <SubmitButton />

            {state?.success && state.data && (
                <Alert className="mt-6" variant={state.data.isSuspicious ? 'destructive' : 'default'}>
                    {state.data.isSuspicious ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    <AlertTitle className="font-headline">AI Analysis Complete</AlertTitle>
                    <AlertDescription>
                        <p className="font-semibold">{state.data.isSuspicious ? "Recommendation: High Priority Investigation" : "Recommendation: Low Priority"}</p>
                        <p><strong>Reason:</strong> {state.data.reason}</p>
                    </AlertDescription>
                </Alert>
            )}
        </form>
    );
}
