import {PageResponse} from "~/features/api/types/HttpResponse.type";
import {ProfileCreationDTO, ProfileResponse} from "~/features/profiles/types/Profile.type";
import ApiHttpClient from "~/features/api/ApiHttpClient";

class ProfileService {
  private static instance: ProfileService

  private constructor() {}

  public static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService()
    }
    return ProfileService.instance
  }

  private getEndpoint(storeId: number | string): string {
    return `/stores/${storeId}/profiles`
  }

  async getByServiceId(
    copypointId: number,
    serviceId: number,
    accessToken: string
  ): Promise<PageResponse<ProfileResponse>> {
    const response = await ApiHttpClient.get<PageResponse<ProfileResponse>>(
      `/copypoints/${copypointId}/services/${serviceId}/profiles`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }

  async getAllByServiceId(
    storeId: number | string,
    serviceId: number | string,
    accessToken: string
  ): Promise<PageResponse<ProfileResponse>> {
    const response = await ApiHttpClient.get<PageResponse<ProfileResponse>>(
      this.getEndpoint(storeId) + '?serviceId=' + serviceId,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  }

  async create(
    storeId: number | string,
    accessToken: string,
    data: ProfileCreationDTO
  ): Promise<ProfileResponse> {
    const response = await ApiHttpClient.post<ProfileResponse>(
      this.getEndpoint(storeId),
      data,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }
}

export default ProfileService.getInstance()
