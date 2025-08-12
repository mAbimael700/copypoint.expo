
import ApiHttpClient from '~/features/api/ApiHttpClient';
import {
  SalesTimelineResponse,
  SalesByCopypointResponse,
  PaymentStatusResponse,
  PaymentMethodDistributionResponse,
  TopServicesResponse,
} from '~/features/dashboard/types/types';

class DashboardService {
  private static instance: DashboardService;

  private constructor() {}

  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  private baseEndpoint = '/dashboard';

  async getSalesTimeline(
    startDate: string,
    endDate: string,
    accessToken: string
  ): Promise<SalesTimelineResponse> {
    const response = await ApiHttpClient.get<SalesTimelineResponse>(
      `${this.baseEndpoint}/sales/timeline`,
      {
        params: { startDate, endDate },
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  }

  async getSalesByCopypoint(
    startDate: string,
    endDate: string,
    accessToken: string
  ): Promise<SalesByCopypointResponse> {
    const response = await ApiHttpClient.get<SalesByCopypointResponse>(
      `${this.baseEndpoint}/sales/by-copypoint`,
      {
        params: { startDate, endDate },
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  }

  async getPaymentStatusDistribution(
    startDate: string,
    endDate: string,
    accessToken: string
  ): Promise<PaymentStatusResponse> {
    const response = await ApiHttpClient.get<PaymentStatusResponse>(
      `${this.baseEndpoint}/payments/status-distribution`,
      {
        params: { startDate, endDate },
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  }

  async getPaymentMethodDistribution(
    startDate: string,
    endDate: string,
    accessToken: string
  ): Promise<PaymentMethodDistributionResponse> {
    const response = await ApiHttpClient.get<PaymentMethodDistributionResponse>(
      `${this.baseEndpoint}/payments/method-distribution`,
      {
        params: { startDate, endDate },
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  }

  async getTopServices(
    startDate: string,
    endDate: string,
    limit: number,
    accessToken: string
  ): Promise<TopServicesResponse> {
    const response = await ApiHttpClient.get<TopServicesResponse>(
      `${this.baseEndpoint}/services/top-services`,
      {
        params: { startDate, endDate, limit },
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  }
}

export default DashboardService.getInstance();
