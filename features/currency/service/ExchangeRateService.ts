import {ExchangeRateCurrencyResponse} from '~/features/currency/types/ExchangeRate.type'
import ApiHttpClient from "~/features/api/ApiHttpClient";

class ExchangeRateService {
    private static instance: ExchangeRateService
    private readonly endpoint = '/exchange-rate'

    private constructor() {
    }

    public static getInstance(): ExchangeRateService {
        if (!ExchangeRateService.instance) {
            ExchangeRateService.instance = new ExchangeRateService()
        }
        return ExchangeRateService.instance
    }

    async getAllCodes(accessToken: string): Promise<ExchangeRateCurrencyResponse> {
        const response = await ApiHttpClient.get<ExchangeRateCurrencyResponse>(
            this.endpoint + '/currencies',
            {headers: {Authorization: `Bearer ${accessToken}`}}
        )
        return response.data
    }

    async getLastestByCurrency(
        currencyIso: string
    ): Promise<any> {
        const response = await ApiHttpClient.get<any>(
            '/latest/' + currencyIso
        )
        return response.data
    }
}

export default ExchangeRateService.getInstance()
