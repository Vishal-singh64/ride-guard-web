import { NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// This is a mock login. In a real application, you would:
// 1. Find the user in your database by email.
// 2. Compare the provided password with the stored hashed password.
// 3. If they match, create a session/JWT token and return it.
// For this demo, we'll just validate the input and return a mock user.

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = loginSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ success: false, message: 'Invalid input.' }, { status: 400 });
        }

        // Mocking a successful login
        const { email } = validation.data;
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // In a real app, never send the password back.
        // The token would be sent instead.
        return NextResponse.json({
            success: true,
            user: {
                email: email,
                name: email.split('@')[0] || 'User',
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
