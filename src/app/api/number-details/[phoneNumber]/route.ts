import { NextResponse } from 'next/server';
import { fraudulentNumbers, fraudDetails } from '@/lib/mock-data';

export async function GET(request: Request, { params }: { params: { phoneNumber: string } }) {
  try {
    const { phoneNumber } = params;
    const normalizedNumber = phoneNumber.replace(/\D/g, '');

    if (fraudulentNumbers.has(normalizedNumber)) {
      // This number is in our fraudulent list, return its details
      const details = fraudDetails[normalizedNumber];
      return NextResponse.json(details);
    } else {
      // This number is not in our list, return a safe report
      return NextResponse.json({
        phoneNumber: normalizedNumber,
        reportCount: 0,
        totalFraudAmount: 0,
        comments: [],
      });
    }
  } catch (error) {
    console.error("Error fetching number details:", error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
