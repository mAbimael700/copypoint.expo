import {PageResponse} from "~/features/api/types/HttpResponse.type";
import {SaleCreationDTO, SaleProfileCreationDTO, SaleResponse, SaleStatus} from "~/features/sales/types/Sale.type";
import ApiHttpClient from "~/features/api/ApiHttpClient";

class SaleService {
    private static instance: SaleService;

    private constructor() {
    }

    public static getInstance(): SaleService {
        if (!SaleService.instance) {
            SaleService.instance = new SaleService();
        }
        return SaleService.instance;
    }

    private getEndpoint(copypointId: number | string): string {
        return `/copypoints/${copypointId}/sales`;
    }

    async getSales(copypointId: number | string,
                   accessToken: string): Promise<PageResponse<SaleResponse>> {
        const response = await ApiHttpClient
            .get<PageResponse<SaleResponse>>(
                this.getEndpoint(copypointId),
                {headers: {Authorization: `Bearer ${accessToken}`}}
            );
        return response.data;
    }

    async getPendingSales(copypointId: number | string,
                          accessToken: string): Promise<PageResponse<SaleResponse>> {
        const response = await ApiHttpClient
            .get<PageResponse<SaleResponse>>(
                this.getEndpoint(copypointId) + "/pending",
                {headers: {Authorization: `Bearer ${accessToken}`}}
            );
        return response.data;
    }


    async create(
        storeId: number | string,
        accessToken: string,
        data: SaleCreationDTO
    ): Promise<SaleResponse> {
        const response = await ApiHttpClient.post<SaleResponse>(
            this.getEndpoint(storeId),
            data,
            {headers: {Authorization: `Bearer ${accessToken}`},}
        );
        return response.data;
    }

    async addProfileToSale(copypointId: number | string,
                           saleId: number | string,
                           accessToken: string,
                           data: SaleProfileCreationDTO): Promise<SaleResponse> {
        const response = await ApiHttpClient.post<SaleResponse>(
            this.getEndpoint(copypointId) + saleId + '/profiles',
            data,
            {headers: {Authorization: `Bearer ${accessToken}`},}
        );
        return response.data;
    }

    async updateSaleStatus(copypointId: number | string,
                           saleId: number | string,
                           accessToken: string,
                           status: SaleStatus): Promise<SaleResponse> {
        const response = await ApiHttpClient.patch<SaleResponse>(
            this.getEndpoint(copypointId) + saleId + '/status?status=' + status,
            {headers: {Authorization: `Bearer ${accessToken}`},}
        );
        return response.data;
    }
}

export default SaleService.getInstance();
