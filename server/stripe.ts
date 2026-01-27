import { getUncachableStripeClient } from './stripeClient.js';

export { isStripeConfigured } from './stripeClient.js';

export interface CheckoutSession {
  url: string;
  sessionId: string;
}

export async function createSubscriptionCheckout(
  successUrl: string,
  cancelUrl: string
): Promise<CheckoutSession> {
  const client = await getUncachableStripeClient();
  
  const priceId = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;
  if (!priceId) {
    throw new Error('Subscription price not configured. Please set up your Stripe products.');
  }

  const session = await client.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return {
    url: session.url || '',
    sessionId: session.id,
  };
}

export async function createDonationCheckout(
  amountCents: number,
  successUrl: string,
  cancelUrl: string
): Promise<CheckoutSession> {
  const client = await getUncachableStripeClient();

  if (amountCents < 100) {
    throw new Error('Minimum donation is $1.00');
  }

  const session = await client.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Support Sancho',
            description: 'One-time donation to support Sancho poetry education platform',
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return {
    url: session.url || '',
    sessionId: session.id,
  };
}

export async function getSessionInfo(sessionId: string): Promise<{ type: string; amount?: number } | null> {
  try {
    const client = await getUncachableStripeClient();
    const session = await client.checkout.sessions.retrieve(sessionId);
    return {
      type: session.mode === 'subscription' ? 'subscription' : 'donation',
      amount: session.amount_total || undefined,
    };
  } catch (error) {
    console.error('Error retrieving Stripe session:', error);
    return null;
  }
}
