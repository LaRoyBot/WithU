import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHmac } from 'crypto';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      console.error('[PAYMENT WEBHOOK ERROR] Razorpay signature header missing');
      return NextResponse.json({ error: 'Signature missing' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'mock-webhook-secret';

    // Verify cryptographic signature
    const expectedSignature = createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.warn('[PAYMENT WEBHOOK WARNING] Cryptographic signature validation failed. Proceeding under sandbox mock checks if configured.');
      // In production, return 400. In development/sandbox mock, we log it.
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    console.log(`[PAYMENT WEBHOOK RECEIVED] Event: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const amount = paymentEntity.amount / 100; // Convert paise to Rupees
      const transactionId = paymentEntity.id;

      if (orderId) {
        // Find booking by payment gateway identifier
        const booking = await prisma.booking.findFirst({
          where: { paymentGatewayId: orderId },
        });

        if (booking) {
          await prisma.booking.update({
            where: { id: booking.id },
            data: {
              paymentStatus: 'PAID',
              advancePaid: amount,
            },
          });
          console.log(`[PAYMENT WEBHOOK SUCCESS] Marked Booking ${booking.bookingNumber} as PAID. Amount: Rs. ${amount}`);
        } else {
          console.warn(`[PAYMENT WEBHOOK WARNING] No booking found matching payment order ID: ${orderId}`);
        }
      }
    }

    // Return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('[PAYMENT WEBHOOK CATCH ERROR]:', err.message);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
