// Mock database of fraudulent numbers.
export const fraudulentNumbers = new Set(['1112223333', '5556667777', '9876543210']);

// Mock detailed information for fraudulent numbers.
export const fraudDetails: { [key: string]: any } = {
    '1112223333': {
        phoneNumber: '1112223333',
        reportCount: 3,
        totalFraudAmount: 450.00,
        comments: [
            { id: 1, author: 'driverA@email.com', text: 'This person called claiming to be from a ride-sharing company and asked for my login details.', date: '2024-05-10T10:00:00Z' },
            { id: 2, author: 'driverB@email.com', text: 'Sent a fake payment link for a trip that never happened.', date: '2024-05-11T14:30:00Z' },
            { id: 3, author: 'driverC@email.com', text: 'Tried the classic "I sent you too much money, please send some back" scam.', date: '2024-05-12T09:00:00Z' },
        ],
    },
    '5556667777': {
        phoneNumber: '5556667777',
        reportCount: 2,
        totalFraudAmount: 120.50,
        comments: [
            { id: 4, author: 'driverD@email.com', text: 'Booked a ride and then claimed they needed me to buy gift cards for them, promising to pay back. They did not.', date: '2024-04-20T18:00:00Z' },
            { id: 5, author: 'driverE@email.com', text: 'Very persistent and suspicious. Kept asking personal questions not related to the ride.', date: '2024-04-22T11:00:00Z' },
        ],
    },
    '9876543210': {
        phoneNumber: '9876543210',
        reportCount: 1,
        totalFraudAmount: 50.00,
        comments: [
            { id: 6, author: 'driverF@email.com', text: 'Cancelled the ride last minute and then sent a phishing text message.', date: '2024-05-01T20:45:00Z' },
        ],
    },
};
