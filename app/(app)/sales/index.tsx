import React from 'react';
import {Main} from "~/components/layout/Main";
import SalesList from "~/features/sales/components/SalesList";
import CopypointSelector from "~/features/copypoints/components/selector/copypoint-selector";

const Index = () => {
    return (
        <Main>
            <CopypointSelector/>
            <SalesList/>
        </Main>
    );
};

export default Index;