import ApiHttpClient from "~/features/api/ApiHttpClient";
import {PageResponse} from "~/features/api/types/HttpResponse.type";
import {Service, ServiceCreationDTO} from "~/features/service/types/Service.type";


class ServiceService {
    private static instance: ServiceService;

    private constructor() { }

    public static getInstance(): ServiceService {
        if (!ServiceService.instance) {
            ServiceService.instance = new ServiceService();
        }
        return ServiceService.instance;
    }


    async getAllByStore(storeId: number | string, accessToken: string):
        Promise<PageResponse<Service>> {
        const response = await ApiHttpClient.get<PageResponse<Service>>(
            `/stores/${storeId}/services`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        return response.data;
    }

    async getAllByCopypoint(copypointId: number | string, accessToken: string): Promise<PageResponse<Service>> {
        const response = await ApiHttpClient.get<PageResponse<Service>>(
            `/stores/${copypointId}/services`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        return response.data;
    }

    async create(
        storeId: number | string,
        accessToken: string,
        data: ServiceCreationDTO
    ): Promise<Service> {
        const response = await ApiHttpClient.post<Service>(
            `/stores/${storeId}/services`,
            data,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        return response.data;
    }
}

export default ServiceService.getInstance();
