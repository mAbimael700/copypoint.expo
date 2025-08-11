import {UseFormReturn} from 'react-hook-form'
import {X} from 'lucide-react-native'
import {formatCurrency} from '~/lib/utils.currency'
import {Button} from '~/components/ui/button'
import {SaleProfileResponse} from '~/features/saleprofiles/type/SaleProfile.type'
import {SaleProfilesFormValues} from '~/features/saleprofiles/components/form/sale-form-schema'
import {SaleProfileQuantityDrawer} from '~/features/saleprofiles/components/input/sale-profile-quantity-input'
import {Text} from "~/components/ui/text";
import {View} from "react-native";

// Tipo extendido para permitir perfiles temporales que no están en la API
type TempSaleProfile = {
    profileId: number
    name: string
    description: string
    unitPrice: number
    quantity: number
    service: {
        id: number
        name: string
    }
}

interface Props {
    saleProfile: SaleProfileResponse | TempSaleProfile
    currentQuantity: number
    fieldIndex: number
    isModified?: boolean
    handleQuantityChange: (
        profileId: number,
        serviceId: number,
        increment: number
    ) => void
    handleValueChange: (
        fieldName: string,
        profileId: number,
        serviceId: number,
        value: number
    ) => void
    handleRemoveProfile: (profileId: number) => void
    form: UseFormReturn<SaleProfilesFormValues>
}

export const SaleProfileItem = ({
                                    saleProfile,
                                    fieldIndex,
                                    handleRemoveProfile,
                                    handleQuantityChange,
                                    handleValueChange,
                                    currentQuantity,
                                    isModified = false,
                                    form,
                                }: Props) => {
    return (
        <View
            className={`flex-row rounded items-center justify-between p-4 h-15 bg-muted ${isModified
                ? 'bg-amber-50/50 rounded px-2 border-l-2 border-amber-400'
                : ''} gap-x-2`} // 👈 separa horizontalmente
        >
            <View className="space-y-1 flex-1">
                <View className="flex-row justify-between items-center gap-1 w-full">
                    <Text className={'font-semibold'}>
                        {saleProfile.name} - {saleProfile.description}
                    </Text>
                    {isModified && (
                        <Text className="text-xs bg-amber-100 px-1.5 py-0.5 rounded-full">
                            Modified
                        </Text>
                    )}
                </View>
                <View className="text-muted-foreground text-sm">
                    <Text>{formatCurrency(saleProfile.unitPrice)}</Text>
                </View>
            </View>

            <SaleProfileQuantityDrawer
                serviceId={saleProfile.service.id}
                profileId={saleProfile.profileId}
                profileName={saleProfile.description}
                currentQuantity={currentQuantity}
                onQuantityChange={handleQuantityChange}
                onValueChange={handleValueChange}
            />

            <Button
                size={'icon'}
                onPress={(e) => {
                    e.preventDefault();
                    handleRemoveProfile(saleProfile.profileId);
                }}
                className="bg-muted-foreground hover:bg-destructive hover:border-destructive text-muted text border-background h-4 w-4 justify-center rounded-full p-2.5 text-xs shadow-sm select-none"
            >
                <X size={10}/>
            </Button>
        </View>

    )
}
