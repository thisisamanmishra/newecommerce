interface DelhiveryConfig {
  apiKey: string;
  environment: 'test' | 'production';
  baseUrl: string;
}

interface CreateShipmentRequest {
  shipments: Array<{
    name: string;
    add: string;
    pin: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    order: string;
    payment_mode: string;
    return_pin: string;
    return_city: string;
    return_phone: string;
    return_add: string;
    return_state: string;
    return_country: string;
    products_desc: string;
    hsn_code: string;
    cod_amount: string;
    order_date: string;
    total_amount: string;
    seller_add: string;
    seller_name: string;
    seller_inv: string;
    quantity: string;
    waybill: string;
    shipment_width: string;
    shipment_height: string;
    weight: string;
    seller_gst_tin: string;
    shipping_mode: string;
    address_type: string;
  }>;
  pickup: string;
}

interface TrackingResponse {
  ShipmentData: Array<{
    Shipment: {
      AWB: string;
      OrderID: string;
      ShipmentType: string;
      PickUpDate: string;
      OriginArea: string;
      DestinationArea: string;
      Consignee: {
        Name: string;
        Address1: string;
        Address2: string;
        Address3: string;
        City: string;
        State: string;
        Country: string;
        PinCode: string;
        Telephone1: string;
      };
      Status: {
        Status: string;
        StatusLocation: string;
        StatusDateTime: string;
        Instructions: string;
        StatusType: string;
      };
      Scans: Array<{
        ScanDetail: {
          ScanDateTime: string;
          ScanType: string;
          Scan: string;
          StatusCode: string;
          Instructions: string;
          ScannedLocation: string;
        };
      }>;
    };
  }>;
}

class DelhiveryService {
  private config: DelhiveryConfig;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_DELHIVERY_API_KEY || '',
      environment: import.meta.env.VITE_DELHIVERY_ENVIRONMENT || 'test',
      baseUrl: import.meta.env.VITE_DELHIVERY_BASE_URL || 'https://track.delhivery.com/api',
    };
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.config.apiKey}`,
    };
  }

  async checkServiceability(pincode: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/p/edit/?pin=${pincode}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      const result = await response.json();

      return {
        success: response.ok,
        data: result
      };
    } catch (error) {
      console.error('Delhivery serviceability check error:', error);
      return {
        success: false,
        error: 'Serviceability check failed'
      };
    }
  }

  async createShipment(orderData: {
    orderId: string;
    customerName: string;
    customerAddress: string;
    customerCity: string;
    customerState: string;
    customerPincode: string;
    customerPhone: string;
    codAmount: number;
    totalAmount: number;
    weight: number;
    dimensions: { length: number; width: number; height: number };
    products: Array<{ name: string; quantity: number; hsn?: string }>;
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const shipmentData: CreateShipmentRequest = {
        shipments: [{
          name: orderData.customerName,
          add: orderData.customerAddress,
          pin: orderData.customerPincode,
          city: orderData.customerCity,
          state: orderData.customerState,
          country: 'India',
          phone: orderData.customerPhone,
          order: orderData.orderId,
          payment_mode: codAmount > 0 ? 'COD' : 'Prepaid',
          return_pin: '110001', // Your return address pincode
          return_city: 'Delhi',
          return_phone: '9999999999', // Your return phone
          return_add: 'Your Return Address', // Your return address
          return_state: 'Delhi',
          return_country: 'India',
          products_desc: orderData.products.map(p => `${p.name} (${p.quantity})`).join(', '),
          hsn_code: orderData.products[0]?.hsn || '1234',
          cod_amount: orderData.codAmount.toString(),
          order_date: new Date().toISOString().split('T')[0],
          total_amount: orderData.totalAmount.toString(),
          seller_add: 'Your Business Address',
          seller_name: 'Your Business Name',
          seller_inv: orderData.orderId,
          quantity: orderData.products.reduce((sum, p) => sum + p.quantity, 0).toString(),
          waybill: '', // Will be auto-generated
          shipment_width: orderData.dimensions.width.toString(),
          shipment_height: orderData.dimensions.height.toString(),
          weight: orderData.weight.toString(),
          seller_gst_tin: 'YOUR_GST_NUMBER',
          shipping_mode: 'Surface',
          address_type: 'home'
        }],
        pickup: 'YOUR_PICKUP_LOCATION'
      };

      const response = await fetch(`${this.config.baseUrl}/cmu/create.json`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(shipmentData)
      });

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          data: {
            awbNumber: result.packages?.[0]?.waybill,
            trackingId: result.packages?.[0]?.refnum,
            estimatedDelivery: result.packages?.[0]?.expected_delivery_date
          }
        };
      } else {
        return {
          success: false,
          error: result.rmk || 'Shipment creation failed'
        };
      }
    } catch (error) {
      console.error('Delhivery shipment creation error:', error);
      return {
        success: false,
        error: 'Shipment creation failed'
      };
    }
  }

  async trackShipment(awbNumber: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/v1/packages/json/?waybill=${awbNumber}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      const result: TrackingResponse = await response.json();

      if (result.ShipmentData && result.ShipmentData.length > 0) {
        const shipment = result.ShipmentData[0].Shipment;
        
        return {
          success: true,
          data: {
            awbNumber: shipment.AWB,
            orderId: shipment.OrderID,
            status: shipment.Status.Status,
            statusLocation: shipment.Status.StatusLocation,
            statusDateTime: shipment.Status.StatusDateTime,
            instructions: shipment.Status.Instructions,
            scans: shipment.Scans?.map(scan => ({
              dateTime: scan.ScanDetail.ScanDateTime,
              location: scan.ScanDetail.ScannedLocation,
              status: scan.ScanDetail.Scan,
              instructions: scan.ScanDetail.Instructions
            })) || []
          }
        };
      } else {
        return {
          success: false,
          error: 'Tracking information not found'
        };
      }
    } catch (error) {
      console.error('Delhivery tracking error:', error);
      return {
        success: false,
        error: 'Tracking failed'
      };
    }
  }

  async cancelShipment(awbNumber: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/p/edit/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          waybill: awbNumber,
          cancellation: true
        })
      });

      const result = await response.json();

      return {
        success: response.ok,
        data: result
      };
    } catch (error) {
      console.error('Delhivery cancellation error:', error);
      return {
        success: false,
        error: 'Cancellation failed'
      };
    }
  }

  async getShippingRates(
    originPincode: string,
    destinationPincode: string,
    weight: number,
    codAmount: number = 0
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/kinko/v1/invoice/charges/.json?` +
        `md=S&ss=Delivered&d_pin=${destinationPincode}&o_pin=${originPincode}&` +
        `cgm=${weight}&pt=Pre-paid&cod=${codAmount}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      const result = await response.json();

      return {
        success: response.ok,
        data: result
      };
    } catch (error) {
      console.error('Delhivery rate calculation error:', error);
      return {
        success: false,
        error: 'Rate calculation failed'
      };
    }
  }
}

export const delhiveryService = new DelhiveryService();