import { NextResponse } from 'next/server';

// Mock database of fraudulent numbers. In a real application, this would be a database.
const fraudulentNumbers = ['1112223333', '5556667777', '9876543210'];

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();
    
    // Normalize the phone number by removing non-digit characters
    const normalizedNumber = phoneNumber.replace(/\D/g, '');

    const isFraud = fraudulentNumbers.includes(normalizedNumber);
    
    // Simulate network delay for a better user experience demonstration
    await new Promise(resolve => setTimeout(resolve, 700));

    return NextResponse.json({ isFraud });
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
