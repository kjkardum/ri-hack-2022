import axios from "../utils/axios";
import {ContainerLocationsQuery} from "./queries/ContainerLocationsQuery";
import {IContainerLocation} from "../types/IContainerLocation";

export const getContainerLocaions = async (query: ContainerLocationsQuery) => {
    let url = `/ContainerLocation/paginated?page=${query.page}&pageSize=${query.pageSize}`;
    if (query.term) {
        url += `&term=${query.term}`;
    }
    if (query.sortBy) {
        url += `&sortBy=${query.sortBy}&sortOrder=${query.sortOrder}`;
    }

    return await axios.get<{data: Array<IContainerLocation>, count: number}>(url);
}

export const getAllContainerLocations = async () => {
    return await axios.get<Array<IContainerLocation>>('/ContainerLocation');
}

export const createContainerLocation = async (containerLocation: IContainerLocation) => {
    return await axios.post<IContainerLocation>('/ContainerLocation', containerLocation);
}

export const getContainerLocation = async (id: string) => {
    return await axios.get<IContainerLocation>(`/ContainerLocation/${id}`);
}

export const updateContainerLocation = async (id: string, containerLocation: IContainerLocation) => {
    return await axios.put<IContainerLocation>(`/ContainerLocation/${id}`, containerLocation);
}
