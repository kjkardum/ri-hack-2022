import axios from "../utils/axios";
import {ContainerLocationsQuery} from "./queries/ContainerLocationsQuery";
import {IContainerLocation} from "../types/IContainerLocation";

export const getContainerLocaions = async (query: ContainerLocationsQuery) => {
    let url = `/Appraisal?page=${query.page}&pageSize=${query.pageSize}`;
    if (query.term) {
        url += `&term=${query.term}`;
    }
    if (query.sortBy) {
        url += `&sortBy=${query.sortBy}&sortOrder=${query.sortOrder}`;
    }

    return await axios.get<{containerLocations: Array<IContainerLocation>, rowCount: number}>(url);
}

export const createContainerLocation = async (containerLocation: IContainerLocation) => {
    return await axios.post<{ id: string }>('/GarbageContainer', containerLocation);
}

export const getAppraisal = async (id: string) => {
    return await axios.get<IContainerLocation>(`/GarbageContainer/${id}`);
}

export const updateAppraisal = async (id: string, containerLocation: IContainerLocation) => {
    return await axios.put(`/GarbageContainer`, {...containerLocation, id});
}
