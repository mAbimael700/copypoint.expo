export const useSaleProfilesBySale = (
    params: ProfilesSaleQueryBySaleParams,
    options?: Omit<
        UseQueryOptions<PageResponse<SaleProfileResponse>>,
        'queryKey' | 'queryFn'
    >
) => {
    const {accessToken, isAuthenticated} = useAuth()
    console.log('useSaleProfilesBySale - params:', params);
    return useQuery({
