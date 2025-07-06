import { NextResponse } from 'next/server';
import { fraudulentNumbers } from '@/lib/mock-data';


export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();
    
    const normalizedNumber = phoneNumber.replace(/\D/g, '');

    const isFraud = fraudulentNumbers.has(normalizedNumber);
    
    await new Promise(resolve => setTimeout(resolve, 700));

    return NextResponse.json({ isFraud, number: normalizedNumber });
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
