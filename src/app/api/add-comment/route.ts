import { NextResponse } from 'next/server';
import { z } from 'zod';

const addCommentSchema = z.object({
    phoneNumber: z.string().min(10, 'A valid phone number is required.'),
    comment: z.string().min(10, 'Comment must be at least 10 characters long.'),
    // In a real app, you'd get the author from a session token
    author: z.string().email(),
});

// Mock function to add a comment to our "database"
// In a real app, you'd save this to a persistent database.
function addComment(data: z.infer<typeof addCommentSchema>) {
    console.log("New comment received:", data);
    // Here you would add logic to save the comment.
    // For now, we just log it and return success.
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = addCommentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ 
          success: false, 
          message: "Validation failed. Please check your input.",
          errors: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }
    
    // In a real app, you would verify user authentication here before proceeding.
    addComment(validation.data);

    return NextResponse.json({ 
        success: true, 
        message: "Comment added successfully."
    });
  } catch (error) {
    console.error("Failed to add comment:", error);
    return NextResponse.json({ 
        success: false, 
        message: "An unexpected error occurred. Please try again later." 
    }, { status: 500 });
  }
}
