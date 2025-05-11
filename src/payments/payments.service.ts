import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema'; // you can still import the interface for typing
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectModel('User') private userModel: Model<User>, // <-- 'User' as string
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET'));
  }

  async createPaymentIntent(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) throw new Error('User not found');

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: 499,
      currency: 'usd',
      metadata: { email },
      payment_method_types: ['card'],
    });

    return { clientSecret: paymentIntent.client_secret };
  }

  async handleWebhook(event: Stripe.Event) {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const email = paymentIntent.metadata.email;
      if (email) {
        await this.userModel.updateOne({ email }, { isPremium: true });
      }
    }
  }
}
