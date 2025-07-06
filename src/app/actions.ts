'use server';

import { z } from 'zod';
import { analyzeFraudReport, type AnalyzeFraudReportOutput } from '@/ai/flows/fraud-report-analyzer';

// Mock database of fraudulent numbers. In a real application, this would be a database.
const fraudulentNumbers = ['1112223333', '5556667777', '9876543210'];

export async function checkNumber(phoneNumber: string): Promise<{ isFraud: boolean }> {
  // Normalize the phone number by removing non-digit characters
  const normalizedNumber = phoneNumber.replace(/\D/g, '');

  const isFraud = fraudulentNumbers.includes(normalizedNumber);
  
  // Simulate network delay for a better user experience demonstration
  await new Promise(resolve => setTimeout(resolve, 700));

  return { isFraud };
}

const reportSchema = z.object({
    reporterPhoneNumber: z.string().min(10, 'A valid phone number is required.').max(15),
    reportedPhoneNumber: z.string().min(10, 'A valid phone number is required.').max(15),
    reportText: z.string().min(20, 'Please provide a detailed report of at least 20 characters.').max(1000),
});

type FormState = {
    success: boolean;
    message: string;
    data?: AnalyzeFraudReportOutput;
    errors?: {
        reporterPhoneNumber?: string[];
        reportedPhoneNumber?: string[];
        reportText?: string[];
    }
} | null;

export async function submitFraudReport(prevState: FormState, formData: FormData) : Promise<FormState> {
    const data = {
        reporterPhoneNumber: formData.get('reporterPhoneNumber') as string,
        reportedPhoneNumber: formData.get('reportedPhoneNumber') as string,
        reportText: formData.get('reportText') as string,
    };

    const validation = reportSchema.safeParse(data);

    if (!validation.success) {
        return { 
            success: false, 
            message: "Validation failed. Please check your input.",
            errors: validation.error.flatten().fieldErrors 
        };
    }

    try {
        const analysisResult = await analyzeFraudReport(validation.data);
        
        // In a real application, you would save the report and analysisResult to a database.
        // If analysisResult.isSuspicious, you might flag the number for human review.
        
        return { 
            success: true, 
            message: "Report submitted successfully for analysis.",
            data: analysisResult
        };
    } catch (error) {
        console.error("AI analysis failed:", error);
        return { 
            success: false, 
            message: "An unexpected error occurred during AI analysis. Please try again later." 
        };
    }
}
