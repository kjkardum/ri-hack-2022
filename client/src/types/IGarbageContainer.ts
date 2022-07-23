export interface IGarbageContainer {
    id: string;
    label: string;
    type: GarbageContainerType;
    maxWeight: number;
    ContainerLocationId?: string;

}

export enum GarbageContainerType {
    Plastic = 0,
    Paper = 1,
    Metal = 2,
    Other = 3,
};

export const GarbageContainerTypeString = (garbageType: GarbageContainerType): string => {
    switch (garbageType) {
        case GarbageContainerType.Plastic:
            return 'Plastic';
        case GarbageContainerType.Paper:
            return 'Paper';
        case GarbageContainerType.Metal:
            return 'Metal';
        case GarbageContainerType.Other:
            return 'Other';
        default:
            return String(GarbageContainerType[garbageType]);
    }
};