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
// 3. Save the new user to your database.
// 4. Handle profile image upload and save the URL.
// For this demo, we'll just validate the input and return success.

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = registerSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ success: false, message: validation.error.errors[0].message }, { status: 400 });
        }

        console.log("Mock registration successful for:", validation.data.name, `(${validation.data.email})`);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return NextResponse.json({ success: true, message: 'Registration successful!' });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'An unexpected error occurred.' }, { status: 500 });
    }
}
