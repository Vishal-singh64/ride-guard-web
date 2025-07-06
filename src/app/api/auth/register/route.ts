import { NextResponse } from 'next/server';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

// This is a mock registration. In a real application, you would:
// 1. Check if a user with that email already exists.
// 2. Hash the password using a library like bcrypt.
// 3. Save the new user to your database (with an `isVerified: false` flag).
// 4. Generate a real, random OTP and its expiry.
// 5. Save the OTP hash to the database against the user record.
// 6. Use an email service (e.g., SendGrid) to send the OTP to the user's email.

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = registerSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ success: false, message: validation.error.errors[0].message }, { status: 400 });
        }

        // --- Mock OTP Generation & "Sending" ---
        const otp = "123456"; // For demo purposes, we use a static OTP
        console.log(`
            ==================================================
            OTP for ${validation.data.email}: ${otp}
            (This would be sent via email in a real app)
            ==================================================
        `);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return NextResponse.json({ success: true, message: `An OTP has been sent to ${validation.data.email}.` });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
