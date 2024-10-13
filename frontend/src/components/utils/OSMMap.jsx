import { useEffect, useRef } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { fromLonLat } from 'ol/proj'
import Feature from 'ol/Feature'
import { Point } from 'ol/geom'
import { Vector as SourceVector } from 'ol/source'
import { Vector as LayerVector } from 'ol/layer'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'

const OSMMap = ({ coordinates }) => {
    const mapRef = useRef(null)

    function initMap() {
        return new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: fromLonLat([coordinates.longitude, coordinates.latitude]),
                zoom: 16,
            }),
            controls: [],
        });
    }

    function createMarker() {
        let feature = new Feature({
            geometry: new Point(fromLonLat([coordinates.longitude, coordinates.latitude]))
        })

        let iconStyle = new Style({
            image: new Icon({
              anchor: [0.5, 400],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              src: 'map-marker.png',
              height: 30,
              width: 30,
            }),
        })

        feature.setStyle(iconStyle)

        return feature
    }

    useEffect(() => {
        const initialMap = initMap()

        let feature = createMarker()

        const markerLayer = new LayerVector({
            source: new SourceVector({
                features: [feature]
            })
        })

        initialMap.addLayer(markerLayer)

        return () => initialMap.setTarget(null)
    }, [])

    return (
        <div
            ref={ mapRef }
            style={{ height: '100%' }}
        />
    )
}

export default OSMMap
