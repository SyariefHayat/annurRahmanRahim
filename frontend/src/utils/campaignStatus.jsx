import { CheckCircle, Clock } from "lucide-react";

export const getStatusIcon = (status) => {
    const icons = {
        "Ongoing": <Clock className="h-5 w-5 text-gray-400" />,
        "Completed": <CheckCircle className="h-5 w-5 text-gray-400" />,
        "Cancelled": <Clock className="h-5 w-5 text-gray-400" />
    };
    
    return icons[status];
};