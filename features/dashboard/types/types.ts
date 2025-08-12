// SalesTimeline
export interface SalesTimelineData {
  date: string; // YYYY-MM-DD
  totalSales: number;
  transactionCount: number;
}

export interface SalesMetrics {
  totalSales: number;
  averagePerTransaction: number;
  totalTransactions: number;
}

export interface SalesTimelineResponse {
  timeline: SalesTimelineData[];
  metrics: SalesMetrics;
}

// SalesByCopypoint
export interface SalesByCopypointData {
  copypointId: number;
  copypointName: string;
  totalSales: number;
  transactionCount: number;
}

export interface SalesByCopypointResponse {
  salesByLocation: SalesByCopypointData[];
  globalMetrics: SalesMetrics;
}

// PaymentStatus
export interface PaymentStatusData {
  status: string;
  count: number;
  percentage: number;
}

export interface PaymentStatusMetrics {
  successRate: number;
  pendingPayments: number;
  failedPayments: number;
  totalPayments: number;
}

export interface PaymentStatusResponse {
  statusDistribution: PaymentStatusData[];
  metrics: PaymentStatusMetrics;
}

// PaymentMethodDistribution
export interface PaymentMethodDistributionData {
  methodDescription: string;
  usageCount: number;
  percentage: number;
}

export interface PaymentMethodDistributionResponse {
  distribution: PaymentMethodDistributionData[];
}

// TopServices
export interface ServiceSalesData {
  serviceId: number;
  serviceName: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface ServiceMetrics {
  top5Services: ServiceSalesData[];
  revenueByService: { serviceName: string; revenue: number }[];
}

export interface TopServicesResponse {
  topServices: ServiceSalesData[];
  metrics: ServiceMetrics;
}
