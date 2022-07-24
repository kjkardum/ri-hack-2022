import {Map, Layer, NavigationControl, Source, Marker, MapLayerMouseEvent, MarkerDragEvent} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {useEffect, useState} from "react";
import {Feature, FeatureCollection, GeoJsonProperties, Geometry} from "geojson";
import {IContainerLocation} from "../types/IContainerLocation";

const MAPBOX_TOKEN = "pk.eyJ1IjoiYWN2aWphbm92aWMiLCJhIjoiY2w1eHR5d2R2MHgxdTNqbnFraDF3ZnhwbyJ9.jjyFYZ7yzw0YOfll-vkewQ"

export interface IContainerLocationType extends IContainerLocation {
    type?: "container" | "candidate";
}

const EditableMap = ({width, height, paths, containers, onAddNewMarker, onUpdateFunc}: {
    paths: [number, number][],
    containers: IContainerLocationType[],
    onAddNewMarker: (newContainer: IContainerLocationType) => Promise<IContainerLocationType | null>,
    onUpdateFunc: (newContainer: IContainerLocationType) => Promise<IContainerLocationType | null>,
    width: number | string,
    height: number | string
}) => {
    const [mapContainers, setMapContainers] = useState<IContainerLocationType[]>(containers);

    useEffect(() => {
        setMapContainers(containers);
    }, [containers]);

    const [mapPaths, setMapPaths] = useState<[number, number][]>(paths);

    console.log(mapContainers);
    console.log(containers);

    const [data, setData] = useState<Feature<Geometry, GeoJsonProperties> | FeatureCollection<Geometry, GeoJsonProperties> | undefined>({
        type: "Feature",
        properties: {},
        geometry: {
            type: "LineString",
            coordinates: paths
        }
    })

    return (
        <Map
            initialViewState={{
                longitude: 14.4510151,
                latitude: 45.3276603,
                zoom: 12.7
            }}
            style={{
                width,
                height
            }}
            mapStyle="mapbox://styles/mapbox/dark-v10"
            mapboxAccessToken={MAPBOX_TOKEN}
            onClick={async (event: MapLayerMouseEvent) => {
                let newCont = await onAddNewMarker({
                    latitude: event.lngLat.lat,
                    longitude: event.lngLat.lng,
                })

                if (newCont)
                    setMapContainers([...mapContainers, newCont]);
            }}
        >
            <NavigationControl position="bottom-right"/>
            <Source id="polylineLayer" type="geojson" data={data}>
                <Layer
                    id="lineLayer"
                    type="line"
                    source="my-data"
                    layout={{
                        "line-join": "round",
                        "line-cap": "round"
                    }}
                    paint={{
                        "line-color": "rgba(3, 170, 238, 0.5)",
                        "line-width": 5
                    }}
                />
            </Source>
            {mapContainers.map((value, index, array) => (
                <Marker
                    key={value.id}
                    longitude={value.longitude}
                    latitude={value.latitude}
                    offset={[0, 0]}
                    draggable={true}
                    color={value.type === "candidate" ? "red" : "blue"}
                    onDragEnd={async (event: MarkerDragEvent) => {
                        if (value.type === "candidate") {
                            let newCont = await onAddNewMarker({
                                latitude: event.lngLat.lat,
                                longitude: event.lngLat.lng,
                                type: "container"
                            })

                            if (newCont)
                                setMapContainers([...mapContainers.filter(c => c.id !== value.id), newCont]);

                            return;
                        }

                        const newPoints: IContainerLocation[] = [...mapContainers];
                        newPoints[index] = {
                            ...newPoints[index],
                            longitude: event.lngLat.lat,
                            latitude: event.lngLat.lng
                        }
                        onUpdateFunc(newPoints[index]);

                        setMapContainers(newPoints);
                    }}
                    onClick={
                        async () => {
                            if (value.type === "candidate") {
                                let newCont = await onAddNewMarker({
                                    latitude: value.latitude,
                                    longitude: value.longitude,
                                    type: "container"
                                })

                                if (newCont)
                                    setMapContainers([...mapContainers.filter(c => c.id !== value.id), newCont]);
                            }
                        }
                    }

                />
            ))}
        </Map>
    )
}

export default EditableMap