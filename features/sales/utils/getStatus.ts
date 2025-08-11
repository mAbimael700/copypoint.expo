import {SaleStatus} from "~/features/sales/types/Sale.type";
import {AlertCircle, CheckCircle, Clock, XCircle} from "lucide-react-native";

export const getStatusConfig = (status: SaleStatus) => {
    switch (status) {
        case SaleStatus.COMPLETED:
            return {icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-100'};
        case SaleStatus.PENDING:
            return {icon: Clock, color: 'text-yellow-500', bgColor: 'bg-yellow-100'};
        case SaleStatus.CANCELLED:
            return {icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-100'};
        case SaleStatus.PAYMENT_PENDING:
            return {icon: Clock, color: 'text-orange-500', bgColor: 'bg-orange-100'};
        case SaleStatus.FAILED:
            return {icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100'};
        default:
            return {icon: AlertCircle, color: 'text-gray-500', bgColor: 'bg-gray-100'};
    }
};