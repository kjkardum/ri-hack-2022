import axios from "../utils/axios";
import {IUser} from "../types/IUser";


export const getOptimalContainers = async (max: number) => {
    return (await axios.get<Array<[number, number]>>(`/Optimizer/placement/${max}`)).data;

}

export const getOptimalRute = async (dirvers: number, capacity: number): Promise<[number, number][][]> => {
    let str = (await axios.get<string>(`/Optimizer/route/${dirvers}/${capacity}`)).data;

    let ret: [number, number][][] = [];

    // @ts-ignore
    let data: Array<Array<{
        geojson?: Array<[number, number]>;
        lat: number;
        lon: number;
    }>> = str as unknown;

    return data.map((x) => {
        return x.map((y) => [y.lat, y.lon]);
    });
}