import {SaleForm, SaleFormValues} from "~/features/sales/components/form/SaleForm";
import FormLayout from "~/components/layout/form-layout";

const CreateSaleForm = () => {

    const onSubmit = (values: SaleFormValues) => {

    }

    return (
        <FormLayout header={''} description={''}>
            <SaleForm handleSubmit={onSubmit}/>
        </FormLayout>
    );
};

export default CreateSaleForm;