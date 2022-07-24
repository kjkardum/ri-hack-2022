export interface IGarbageContainer {
    id?: string;
    label: string;
    type: GarbageContainerType;
    maxWeight: number;
    containerLocationId?: string;

}

export enum GarbageContainerType {
    Plastic = 1,
    Paper = 2,
    Metal = 3,
    Other = 4,
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