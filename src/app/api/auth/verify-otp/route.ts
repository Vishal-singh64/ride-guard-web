import { NextResponse } from 'next/server';
import { z } from 'zod';

const verifyOtpSchema = z.object({
  email: z.string().email('A valid email is required.'),
  otp: z.string().length(6, 'OTP must be 6 digits.'),
});

// This is a mock OTP verification. In a real application, you would:
// 1. Find the user in the database by email.
// 2. Check if they have an unexpired OTP hash.
// 3. Compare the provided OTP with the stored hash.
// 4. If they match, update the user's record (e.g., set `isVerified: true`).
// 5. Invalidate the used OTP.

const MOCK_OTP = "123456";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = verifyOtpSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ success: false, message: 'Invalid input.' }, { status: 400 });
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (validation.data.otp === MOCK_OTP) {
            // OTP is correct
             console.log(`OTP verification successful for: ${validation.data.email}`);
            // In a real app, you'd now mark the user as verified in your database.
            return NextResponse.json({ success: true, message: 'Account verified successfully!' });
        } else {
            // OTP is incorrect
            return NextResponse.json({ success: false, message: 'Invalid OTP. Please try again.' }, { status: 400 });
        }

    } catch (error) {
        return NextResponse.json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
