import {GarbageContainerType} from "../../types/IGarbageContainer";

export interface GarbageContainersQuery {
    page: number
    pageSize: number
    sortOrder: string
    sortBy: string
    term: string
    type: Array<GarbageContainerType>
}