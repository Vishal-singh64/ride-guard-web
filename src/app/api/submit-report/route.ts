import { NextResponse } from 'next/server';
import { z } from 'zod';

const reportSchema = z.object({
    reporterPhoneNumber: z.string().min(10, 'A valid phone number is required.').max(15),
    reportedPhoneNumber: z.string().min(10, 'A valid phone number is required.').max(15),
    reportText: z.string().min(20, 'Please provide a detailed report of at least 20 characters.').max(1000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = reportSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ 
          success: false, 
          message: "Validation failed. Please check your input.",
          errors: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    // In a real application, you would save the report to a database.
    console.log("Fraud report received:", validation.data);

    return NextResponse.json({ 
        success: true, 
        message: "Report submitted successfully."
    });
  } catch (error) {
    console.error("Report submission failed:", error);
    return NextResponse.json({ 
        success: false, 
        message: "An unexpected error occurred. Please try again later." 
    }, { status: 500 });
  }
}
