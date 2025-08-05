import {PageResponse} from "~/features/api/types/HttpResponse.type";
import {CopypointCreationDTO, CopypointResponse} from "~/features/copypoints/types/Copypoint.type";
import ApiHttpClient from "~/features/api/ApiHttpClient";


class CopypointService {
    private static instance: CopypointService

    //private static readonly endpoint: "/copypoints"
    private constructor() {}

    public static getInstance(): CopypointService {
        if (!CopypointService.instance) {
            CopypointService.instance = new CopypointService()
        }
        return CopypointService.instance
    }

    async getAllByStore(
        storeId: number | string,
        accessToken: string
    ): Promise<PageResponse<CopypointResponse>> {
        const response = await ApiHttpClient.get<PageResponse<CopypointResponse>>(
            `/stores/${storeId}/copypoints`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        return response.data
    }

    async create(
        storeId: number | string,
        accessToken: string,
        data: CopypointCreationDTO
    ): Promise<CopypointResponse> {
        const response = await ApiHttpClient.post<CopypointResponse>(
            `/stores/${storeId}/copypoints`,
            data,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        return response.data
    }
}

export default CopypointService.getInstance()
