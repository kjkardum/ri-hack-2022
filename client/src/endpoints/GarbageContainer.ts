import axios from "../utils/axios";
import {GarbageContainersQuery} from "./queries/GarbageContainersQuery";
import {IGarbageContainer} from "../types/IGarbageContainer";

export const getGarbageContainers = async (query: GarbageContainersQuery) => {
    let url = `/GarbageContainer/paginated?page=${query.page}&pageSize=${query.pageSize}`;
    if (query.term) {
        url += `&term=${query.term}`;
    }
    if (query.sortBy) {
        url += `&sortBy=${query.sortBy}&sortOrder=${query.sortOrder}`;
    }

    return await axios.get<{data: Array<IGarbageContainer>, count: number}>(url);
}

export const createGarbageContainer = async (containerLocation: IGarbageContainer) => {
    return await axios.post<IGarbageContainer>('/GarbageContainer', containerLocation);
}

export const getGarbageContainer = async (id: string) => {
    return await axios.get<IGarbageContainer>(`/GarbageContainer/${id}`);
}

export const updateGarbageContainer = async (id: string, containerLocation: IGarbageContainer) => {
    return await axios.put(`/GarbageContainer`, {...containerLocation, id});
}
