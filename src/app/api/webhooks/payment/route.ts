import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHmac, timingSafeEqual } from 'node:crypto';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      console.error('[PAYMENT WEBHOOK ERROR] Razorpay signature header missing');
      return NextResponse.json({ error: 'Signature missing' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('[PAYMENT WEBHOOK ERROR] Webhook secret is not configured');
      return NextResponse.json({ error: 'Webhook unavailable' }, { status: 503 });
    }

    // Verify cryptographic signature
    const expectedSignature = createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const expected = Buffer.from(expectedSignature, 'hex');
    const received = /^[a-f0-9]+$/i.test(signature) ? Buffer.from(signature, 'hex') : Buffer.alloc(0);
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
      console.warn('[PAYMENT WEBHOOK WARNING] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    console.log(`[PAYMENT WEBHOOK RECEIVED] Event: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload?.payload?.payment?.entity;
      if (!paymentEntity?.order_id || !paymentEntity?.id || paymentEntity.status !== 'captured') {
        return NextResponse.json({ error: 'Invalid payment event' }, { status: 400 });
      }
      const orderId = paymentEntity.order_id;
      const amountPaise = Number(paymentEntity.amount);

      if (orderId) {
        // Find booking by payment gateway identifier
        const booking = await prisma.booking.findFirst({
          where: { paymentGatewayId: orderId },
        });

        if (booking) {
          const expectedAmountPaise = Math.round(Number(booking.totalAmount) * 100);
          if (!Number.isSafeInteger(amountPaise) || amountPaise !== expectedAmountPaise) {
            console.error('[PAYMENT WEBHOOK ERROR] Payment amount does not match booking');
            return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
          }
          await prisma.booking.update({
            where: { id: booking.id },
            data: {
              paymentStatus: 'PAID',
              advancePaid: Number(booking.totalAmount),
            },
          });
          console.info('[PAYMENT WEBHOOK SUCCESS] Booking payment status updated');
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
