import {Map, Layer, NavigationControl, Source, Marker, MapLayerMouseEvent} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {useState} from "react";
import {Feature, FeatureCollection, GeoJsonProperties, Geometry} from "geojson";

const MAPBOX_TOKEN = "pk.eyJ1IjoiYWN2aWphbm92aWMiLCJhIjoiY2w1eHR5d2R2MHgxdTNqbnFraDF3ZnhwbyJ9.jjyFYZ7yzw0YOfll-vkewQ"

const RouteMap = ({width, height, lines, points, onClickFunc}: {
    lines: [
        number, number,
    ][][],
    points: [number, number][],
    onClickFunc: (event: MapLayerMouseEvent) => void,
    width: number | string,
    height: number | string
}) => {

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

            <Source id="polylineLayer" type="geojson" data={
                {
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "LineString",
                        coordinates: lines[0]?.map(value => [value[1], value[0]])
                    }
                }
            }>
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

export default RouteMap;