import CryptoJS from 'crypto-js';

interface PhonePeConfig {
  merchantId: string;
  saltKey: string;
  saltIndex: string;
  environment: 'sandbox' | 'production';
  callbackUrl: string;
  redirectUrl: string;
}

interface PaymentRequest {
  merchantTransactionId: string;
  amount: number;
  merchantUserId: string;
  redirectUrl: string;
  callbackUrl: string;
  mobileNumber?: string;
  deviceContext?: {
    deviceOS: string;
  };
  paymentInstrument: {
    type: 'PAY_PAGE';
  };
}

class PhonePeService {
  private config: PhonePeConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      merchantId: import.meta.env.VITE_PHONEPE_MERCHANT_ID || '',
      saltKey: import.meta.env.VITE_PHONEPE_SALT_KEY || '',
      saltIndex: import.meta.env.VITE_PHONEPE_SALT_INDEX || '1',
      environment: import.meta.env.VITE_PHONEPE_ENVIRONMENT || 'sandbox',
      callbackUrl: import.meta.env.VITE_PHONEPE_CALLBACK_URL || '',
      redirectUrl: import.meta.env.VITE_PHONEPE_REDIRECT_URL || '',
    };

    this.baseUrl = this.config.environment === 'production' 
      ? 'https://api.phonepe.com/apis/hermes'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
  }

  private generateChecksum(payload: string): string {
    const string = payload + '/pg/v1/pay' + this.config.saltKey;
    const sha256 = CryptoJS.SHA256(string);
    return sha256.toString(CryptoJS.enc.Hex) + '###' + this.config.saltIndex;
  }

  private generateTransactionId(): string {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);
  }

  async initiatePayment(
    amount: number,
    orderId: string,
    userId: string,
    userPhone?: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const merchantTransactionId = this.generateTransactionId();
      
      const paymentRequest: PaymentRequest = {
        merchantTransactionId,
        amount: amount * 100, // Convert to paise
        merchantUserId: userId,
        redirectUrl: `${this.config.redirectUrl}?orderId=${orderId}`,
        callbackUrl: this.config.callbackUrl,
        mobileNumber: userPhone,
        deviceContext: {
          deviceOS: 'WEB'
        },
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      const payload = JSON.stringify(paymentRequest);
      const payloadBase64 = btoa(payload);
      const checksum = this.generateChecksum(payloadBase64);

      const response = await fetch(`${this.baseUrl}/pg/v1/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
        },
        body: JSON.stringify({
          request: payloadBase64
        })
      });

      const result = await response.json();

      if (result.success && result.data?.instrumentResponse?.redirectInfo?.url) {
        return {
          success: true,
          data: {
            paymentUrl: result.data.instrumentResponse.redirectInfo.url,
            merchantTransactionId,
            orderId
          }
        };
      } else {
        return {
          success: false,
          error: result.message || 'Payment initiation failed'
        };
      }
    } catch (error) {
      console.error('PhonePe payment initiation error:', error);
      return {
        success: false,
        error: 'Payment service unavailable'
      };
    }
  }

  async checkPaymentStatus(
    merchantTransactionId: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const checksum = this.generateChecksum(`/pg/v1/status/${this.config.merchantId}/${merchantTransactionId}`);

      const response = await fetch(
        `${this.baseUrl}/pg/v1/status/${this.config.merchantId}/${merchantTransactionId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': this.config.merchantId,
          }
        }
      );

      const result = await response.json();

      return {
        success: result.success,
        data: result.data
      };
    } catch (error) {
      console.error('PhonePe status check error:', error);
      return {
        success: false,
        error: 'Status check failed'
      };
    }
  }

  async refundPayment(
    merchantTransactionId: string,
    amount: number,
    orderId: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const refundTransactionId = 'REFUND' + Date.now();
      
      const refundRequest = {
        merchantTransactionId: refundTransactionId,
        originalTransactionId: merchantTransactionId,
        amount: amount * 100, // Convert to paise
        callbackUrl: this.config.callbackUrl
      };

      const payload = JSON.stringify(refundRequest);
      const payloadBase64 = btoa(payload);
      const checksum = this.generateChecksum(payloadBase64);

      const response = await fetch(`${this.baseUrl}/pg/v1/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
        },
        body: JSON.stringify({
          request: payloadBase64
        })
      });

      const result = await response.json();

      return {
        success: result.success,
        data: result.data
      };
    } catch (error) {
      console.error('PhonePe refund error:', error);
      return {
        success: false,
        error: 'Refund failed'
      };
    }
  }
}

export const phonePeService = new PhonePeService();