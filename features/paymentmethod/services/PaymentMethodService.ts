import {PageResponse} from "~/features/api/types/HttpResponse.type";
import {PaymentMethod} from "~/features/paymentmethod/types/PaymentMethod.type";
import ApiHttpClient from "~/features/api/ApiHttpClient";

class PaymentMethodService {
    private static instance: PaymentMethodService;
    private readonly endpoint = '/payment-methods'

    private constructor() { }

    public static getInstance(): PaymentMethodService {
        if (!PaymentMethodService.instance) {
            PaymentMethodService.instance = new PaymentMethodService();
        }
        return PaymentMethodService.instance;
    }


    async getAll(): Promise<PageResponse<PaymentMethod>> {
        const response = await ApiHttpClient.get<PageResponse<PaymentMethod>>(this.endpoint);
        return response.data;
    }

}

export default PaymentMethodService.getInstance();
