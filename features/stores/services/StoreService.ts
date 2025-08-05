import {PageResponse} from "~/features/api/types/HttpResponse.type";
import {StoreCreationDTO, StoreResponse} from "~/features/stores/types/Store.type";
import ApiHttpClient from "~/features/api/ApiHttpClient";


class StoreService {
    private static instance: StoreService;
    private readonly endpoint = '/stores'

    private constructor() {
    }

    public static getInstance(): StoreService {
        if (!StoreService.instance) {
            StoreService.instance = new StoreService();
        }
        return StoreService.instance;
    }

    async getAll(accessToken: string): Promise<PageResponse<StoreResponse>> {
        const response = await ApiHttpClient
            .get<PageResponse<StoreResponse>>(this.endpoint,
                {headers: {'Authorization': `Bearer ${accessToken}`}}
            );
        return response.data;
    }

    async create(accessToken: string,
                 data: StoreCreationDTO) {
        const response = await ApiHttpClient.post<StoreResponse>(this.endpoint,
            data,
            {headers: {'Authorization': `Bearer ${accessToken}`}}
        );
        return response.data;
    }

}

export default StoreService.getInstance();