import { Controller, Post, Req, Body, Headers } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Controller()
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService,
  ) {}

  @Post('payments/create-intent')
  async createIntent(@Body('email') email: string) {
    return this.paymentsService.createPaymentIntent(email);
  }

  @Post('stripe/webhook')
  async stripeWebhook(
    @Req() request: any,
    @Headers('stripe-signature') signature: string,
  ) {
    const stripe = new Stripe(this.configService.get('STRIPE_SECRET'));


    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    const event = stripe.webhooks.constructEvent(
      request.rawBody,
      signature,
      webhookSecret,
    );

    await this.paymentsService.handleWebhook(event);
 
  
    return { received: true };
  }
}
