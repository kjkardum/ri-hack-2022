import axios from "../utils/axios";
import {IUser} from "../types/IUser";


export const getOptimalContainers = async (max: number) => {
    return (await axios.get<Array<[number, number]>>(`/Optimizer/placement/${max}`)).data;

}