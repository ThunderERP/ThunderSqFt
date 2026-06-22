import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
  async emitToZapier(eventType: string, payload: Record<string, any>) {
    const zapierWebhookUrl = process.env[`ZAPIER_WEBHOOK_${eventType.toUpperCase()}`];
    if (!zapierWebhookUrl) return;

    try {
      const response = await fetch(zapierWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: eventType,
          timestamp: new Date().toISOString(),
          data: payload,
        }),
      });

      if (!response.ok) {
        console.error(`Zapier webhook error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error emitting webhook to Zapier:', error);
    }
  }
}
