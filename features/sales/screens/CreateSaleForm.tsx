import {SaleForm, SaleFormValues} from "~/features/sales/components/form/SaleForm";
import FormLayout from "~/components/layout/form-layout";
import useSalesOperations from "~/features/sales/hooks/useSales";
import {useSaleContext} from "~/features/sales/context/useSaleContext";
import {useRouter} from "expo-router";

const CreateSaleForm = () => {
    const createSale = useSalesOperations().createSale
    const {setCurrentSale} = useSaleContext()
    const router = useRouter()

    const onSubmit = async (values: SaleFormValues) => {
        const savedSale = await createSale(values)
        setCurrentSale(savedSale)
    }

    return (
        <FormLayout
            header={'Create a new sale'}
            className={'px-5'}
            description={'Register a new sale for your copypoint.'}
        >
            <SaleForm
                handleSubmit={onSubmit}
                finallyFn={() => router.push('/(app)/sales')}
            />
        </FormLayout>
    );
};

export default CreateSaleForm;