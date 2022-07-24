import {Map, Layer, NavigationControl, Source, Marker, MapLayerMouseEvent} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {useState} from "react";
import ReactMapGL, {Feature, FeatureCollection, GeoJsonProperties, Geometry} from "geojson";

import mapboxgl from "mapbox-gl"; // This is a dependency of react-map-gl even if you didn't explicitly install it

// eslint-disable-next-line import/no-webpack-loader-syntax
(mapboxgl as any).workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const MAPBOX_TOKEN = "pk.eyJ1IjoiYWN2aWphbm92aWMiLCJhIjoiY2w1eHR5d2R2MHgxdTNqbnFraDF3ZnhwbyJ9.jjyFYZ7yzw0YOfll-vkewQ"

const NativeMap = ({width, height, lines, points, onClickFunc}: {
    lines: [number, number][],
    points: [number, number][],
    onClickFunc: (event: MapLayerMouseEvent) => void,
    width: number | string,
    height: number | string
}) => {
    const [data, setData] = useState<Feature<Geometry, GeoJsonProperties> | FeatureCollection<Geometry, GeoJsonProperties> | undefined>({
        type: "Feature",
        properties: {},
        geometry: {
            type: "LineString",
            coordinates: lines
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
            onClick={(event: MapLayerMouseEvent) => onClickFunc(event)}
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
            {points.map((value, index, array) => (
                <Marker
                    key={index}
                    longitude={value[0]}
                    latitude={value[1]}
                    offset={[0, 0]}
                />
            ))}
        </Map>
    )
}

export default NativeMap