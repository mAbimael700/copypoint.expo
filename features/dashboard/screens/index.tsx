import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
} from 'react-native'
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit'
import { useStores } from '~/features/stores/hooks/useStore'
import { useCopypoints } from '~/features/copypoints/hooks/useCopypoints'
import { useStoreContext } from '~/features/stores/context/useStoreContext'
import { useCopypointContext } from '~/features/copypoints/context/useCopypointContext'
import {
    useSalesTimeline,
    useSalesByCopypoint,
    usePaymentStatusDistribution,
    usePaymentMethodDistribution,
    useTopServices,
} from '~/features/dashboard/hooks/useDashboard'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Main } from '~/components/layout/Main'

const { width } = Dimensions.get('window')

export default function DashboardScreen() {
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    // Hooks para obtener datos
    const { data: storesData, isLoading: storesLoading } = useStores()
    const { activeStore, setActiveStore } = useStoreContext()
    const { currentCopypoint, setCurrentCopypoint } = useCopypointContext()

    // Obtener copypoints del store activo
    const { data: copypointsData, isLoading: copypointsLoading } = useCopypoints({
        storeId: activeStore?.id || 0,
        enabled: !!activeStore?.id,
    })

    // Configurar fechas por defecto (últimos 30 días)
    useEffect(() => {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 30)

        setEndDate(end.toISOString().split('T')[0])
        setStartDate(start.toISOString().split('T')[0])
    }, [])

    // Seleccionar automáticamente el primer store si no hay ninguno
    useEffect(() => {
        if (storesData?.content && storesData.content.length > 0 && !activeStore) {
            setActiveStore(storesData.content[0])
        }
    }, [storesData, activeStore, setActiveStore])

    // Seleccionar automáticamente el primer copypoint si no hay ninguno
    useEffect(() => {
        if (copypointsData?.content && copypointsData.content.length > 0 && !currentCopypoint) {
            setCurrentCopypoint(copypointsData.content[0])
        }
    }, [copypointsData, currentCopypoint, setCurrentCopypoint])

    // Hooks del dashboard
    const salesTimeline = useSalesTimeline(
        { startDate, endDate },
        { enabled: !!startDate && !!endDate && !!currentCopypoint }
    )

    const salesByCopypoint = useSalesByCopypoint(
        { startDate, endDate },
        { enabled: !!startDate && !!endDate }
    )

    const paymentStatus = usePaymentStatusDistribution(
        { startDate, endDate },
        { enabled: !!startDate && !!endDate }
    )

    const paymentMethods = usePaymentMethodDistribution(
        { startDate, endDate },
        { enabled: !!startDate && !!endDate }
    )

    const topServices = useTopServices(
        { startDate, endDate, limit: 5 },
        { enabled: !!startDate && !!endDate }
    )

    const isLoading = storesLoading || copypointsLoading ||
        salesTimeline.isLoading || salesByCopypoint.isLoading ||
        paymentStatus.isLoading || paymentMethods.isLoading || topServices.isLoading

    const onRefresh = () => {
        salesTimeline.refetch()
        salesByCopypoint.refetch()
        paymentStatus.refetch()
        paymentMethods.refetch()
        topServices.refetch()
    }

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-4 text-gray-600">Cargando dashboard...</Text>
            </View>
        )
    }

    if (!activeStore) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <Text className="text-gray-600 text-center px-6">
                    No hay tiendas disponibles. Por favor, crea una tienda primero.
                </Text>
            </View>
        )
    }

    if (!currentCopypoint) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <Text className="text-gray-600 text-center px-6">
                    No hay copypoints disponibles en esta tienda. Por favor, crea un copypoint primero.
                </Text>
            </View>
        )
    }

    return (
        <ScrollView
            className="flex-1 bg-gray-50"
            refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
            }
        >
            <Main className="flex-col gap-4 px-4">
                {/* Header */}
                <Card className="m-4 border-0 shadow-none">
                    <CardHeader className="pb-2">
                        <CardTitle>Dashboard</CardTitle>
                        <Text className="text-primary mt-1">
                            {activeStore.name} - {currentCopypoint.name}
                        </Text>
                        <Text className="text-sm text-muted-foreground mt-1">
                            {startDate && endDate && `${format(new Date(startDate), 'dd/MM/yyyy', { locale: es })} - ${format(new Date(endDate), 'dd/MM/yyyy', { locale: es })}`}
                        </Text>
                    </CardHeader>
                </Card>

                {/* Métricas principales */}
                {salesTimeline.data && (
                    <Card className="m-4">
                        <CardHeader>
                            <CardTitle className="text-lg">Resumen de Ventas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <View className="flex-row justify-between">
                                <View className="items-center flex-1">
                                    <Text className="text-2xl font-bold text-primary"
                                        style={{ color: '#3b82f6' }}
                                    >
                                        ${salesTimeline.data.metrics.totalSales.toLocaleString()}
                                    </Text>
                                    <Text className="text-sm text-muted-foreground">Total Ventas</Text>
                                </View>
                                <View className="items-center flex-1">
                                    <Text className="text-2xl font-bold text-primary"
                                        style={{ color: '#970db6' }}
                                    >
                                        {salesTimeline.data.metrics.totalTransactions}
                                    </Text>
                                    <Text className="text-sm text-muted-foreground">Transacciones</Text>
                                </View>
                                <View className="items-center flex-1">
                                    <Text className="text-2xl font-bold text-primary"
                                        style={{ color: '#21b60d' }}
                                    >
                                        ${salesTimeline.data.metrics.averagePerTransaction.toFixed(2)}
                                    </Text>
                                    <Text className="text-sm text-muted-foreground">Promedio</Text>
                                </View>
                            </View>
                        </CardContent>
                    </Card>
                )}

                {/* Gráfica de línea - Timeline de ventas */}
                {salesTimeline.data && salesTimeline.data.timeline.length > 0 && (
                    <Card className="m-4">
                        <CardHeader>
                            <CardTitle className="text-lg">Evolución de Ventas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LineChart
                                data={{
                                    labels: salesTimeline.data.timeline.map(item =>
                                        format(new Date(item.date), 'dd/MM', { locale: es })
                                    ),
                                    datasets: [{
                                        data: salesTimeline.data.timeline.map(item => item.totalSales)
                                    }]
                                }}
                                width={width - 64}
                                height={220}
                                chartConfig={{
                                    backgroundColor: '#ffffff',
                                    backgroundGradientFrom: '#ffffff',
                                    backgroundGradientTo: '#ffffff',
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    },
                                    propsForDots: {
                                        r: '6',
                                        strokeWidth: '2',
                                        stroke: '#3b82f6'
                                    }
                                }}
                                bezier
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16
                                }}
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Gráfica de barras - Ventas por copypoint */}
                {salesByCopypoint.data && salesByCopypoint.data.salesByLocation.length > 0 && (
                    <Card className="m-4">
                        <CardHeader>
                            <CardTitle className="text-lg">Ventas por Ubicación</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BarChart
                                data={{
                                    labels: salesByCopypoint.data.salesByLocation.map(item =>
                                        item.copypointName.length > 8 ?
                                            item.copypointName.substring(0, 8) + '...' :
                                            item.copypointName
                                    ),
                                    datasets: [{
                                        data: salesByCopypoint.data.salesByLocation.map(item => item.totalSales)
                                    }]
                                }}
                                width={width - 64}
                                height={220}
                                yAxisLabel=""
                                yAxisSuffix=""
                                chartConfig={{
                                    backgroundColor: '#ffffff',
                                    backgroundGradientFrom: '#ffffff',
                                    backgroundGradientTo: '#ffffff',
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    }
                                }}
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16
                                }}
                                fromZero
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Gráfica circular - Distribución de métodos de pago */}
                {paymentMethods.data && paymentMethods.data.distribution.length > 0 && (
                    <Card className="m-4">
                        <CardHeader>
                            <CardTitle className="text-lg">Métodos de Pago</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <View className="items-center">
                                <PieChart
                                    data={paymentMethods.data.distribution.map((item, index) => ({
                                        name: item.methodDescription,
                                        population: item.usageCount,
                                        color: [
                                            '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
                                        ][index % 5],
                                        legendFontColor: '#7f9c9f',
                                        legendFontSize: 12
                                    }))}
                                    width={width - 64}
                                    height={220}
                                    chartConfig={{
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    }}
                                    accessor="population"
                                    backgroundColor="transparent"
                                    paddingLeft="15"
                                    absolute
                                />
                            </View>
                        </CardContent>
                    </Card>
                )}

                {/* Gráfica circular - Estado de pagos */}
                {paymentStatus.data && paymentStatus.data.statusDistribution.length > 0 && (
                    <Card className="m-4">
                        <CardHeader>
                            <CardTitle className="text-lg">Estado de Pagos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <View className="items-center">
                                <PieChart
                                    data={paymentStatus.data.statusDistribution.map((item, index) => ({
                                        name: item.status,
                                        population: item.count,
                                        color: [
                                            '#10b981', '#f59e0b', '#ef4444', '#6b7280'
                                        ][index % 4],
                                        legendFontColor: '#7f9c9f',
                                        legendFontSize: 12
                                    }))}
                                    width={width - 64}
                                    height={220}
                                    chartConfig={{
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    }}
                                    accessor="population"
                                    backgroundColor="transparent"
                                    paddingLeft="15"
                                    absolute
                                />
                            </View>

                            {/* Métricas adicionales */}
                            <View className="mt-4 pt-4 border-t border-border">
                                <View className="flex-row justify-between">
                                    <View className="items-center flex-1">
                                        <Text className="text-lg font-semibold text-green-600"
                                            style={{ color: '#10b981' }}>
                                            {paymentStatus.data.metrics.successRate.toFixed(1)}%
                                        </Text>
                                        <Text className="text-sm text-muted-foreground"
                                            style={{ color: '#10b981' }}>Tasa de Éxito</Text>
                                    </View>
                                    <View className="items-center flex-1">
                                        <Text className="text-lg font-semibold text-yellow-600"
                                            style={{ color: '#f59e0b' }}>
                                            {paymentStatus.data.metrics.pendingPayments}
                                        </Text>
                                        <Text className="text-sm text-muted-foreground">Pendientes</Text>
                                    </View>
                                    <View className="items-center flex-1">
                                        <Text className="text-lg font-semibold text-red-600"
                                            style={{ color: '#ef4444' }}>
                                            {paymentStatus.data.metrics.failedPayments}
                                        </Text>
                                        <Text className="text-sm text-muted-foreground">Fallidos</Text>
                                    </View>
                                </View>
                            </View>
                        </CardContent>
                    </Card>
                )}

                {/* Top servicios */}
                {topServices.data && topServices.data.topServices.length > 0 && (
                    <Card className="m-4">
                        <CardHeader>
                            <CardTitle className="text-lg">Top 5 Servicios</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {topServices.data.topServices.map((service, index) => (
                                <View key={service.serviceId} className="flex-row justify-between items-center py-2 border-b border-border last:border-b-0">
                                    <View className="flex-row items-center flex-1">
                                        <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                                            <Text className="text-blue-600 font-semibold text-sm">{index + 1}</Text>
                                        </View>
                                        <Text className="text-foreground flex-1" numberOfLines={1}>
                                            {service.serviceName}
                                        </Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-foreground font-semibold">
                                            ${service.totalRevenue.toLocaleString()}
                                        </Text>
                                        <Text className="text-sm text-muted-foreground">
                                            {service.quantitySold} vendidos
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Espacio al final */}
                <View className="h-8" />
            </Main>
        </ScrollView>
    )
}
