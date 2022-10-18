import { OrderHdrDto } from "@/services/client";

export interface OrderBatchDto extends OrderHdrDto {
    cod?: number
}