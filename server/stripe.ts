import Stripe from 'stripe';

let stripe: Stripe | null = null;

function getStripeClient(): Stripe | null {
  if (stripe) return stripe;
  
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.warn('Stripe not configured: STRIPE_SECRET_KEY not found');
    return null;
  }
  
  stripe = new Stripe(secretKey);
  return stripe;
}

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

export interface CheckoutSession {
  url: string;
  sessionId: string;
}

export async function createSubscriptionCheckout(
  successUrl: string,
  cancelUrl: string
): Promise<CheckoutSession> {
  const client = getStripeClient();
  if (!client) {
    throw new Error('Stripe is not configured. Please connect your Stripe account.');
  }

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
  const client = getStripeClient();
  if (!client) {
    throw new Error('Stripe is not configured. Please connect your Stripe account.');
  }

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
  const client = getStripeClient();
  if (!client) return null;

  try {
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

export async function handleWebhookEvent(
  payload: string | Buffer,
  signature: string
): Promise<{ type: string; data: any } | null> {
  const client = getStripeClient();
  if (!client) return null;

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn('Stripe webhook secret not configured');
    return null;
  }

  try {
    const event = client.webhooks.constructEvent(payload, signature, webhookSecret);
    return {
      type: event.type,
      data: event.data.object,
    };
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return null;
  }
}
