import { Component, Input } from "@angular/core";
import { AreaOfInterest } from "@awarns/geofencing";
import { getConfig } from "~/app/core/config";
import { EventData } from "@nativescript/core";
import { Bounds, MapboxView } from "@nativescript-community/ui-mapbox";
import {
    Feature,
    FeatureCollection,
    featureCollection,
    point,
} from "@turf/helpers";
import buffer from "@turf/buffer";
import bbox from "@turf/bbox";
import { getLogger, Logger } from "~/app/core/utils/logger";

const PLACES_LAYER_ID = "places";
const FILL_COLOR = "#1F525E";
const FILL_OPACITY = 0.6;
const MAP_VIEWPORT_PADDING = 50;

@Component({
    selector: "SymPlacesMap",
    templateUrl: "./places-map.component.html",
    styleUrls: ["./places-map.component.scss"],
})
export class PlacesMapComponent {
    @Input()
    set places(places: Array<AreaOfInterest>) {
        this._places = places;
        if (!this.map) return;
        this.reInitMap()
            .then(() => (this.initialized = true))
            .catch((err) => {
                this.logger.error(
                    `Could not re-initialize map. Reason: ${err}`
                );
                this.initialized = false;
            });
    }
    @Input()
    set highlightedPlace(place: AreaOfInterest) {
        if (!this.map) return;
        this.centerViewport(true, place);
    }

    get accessToken(): string {
        return getConfig().mapboxAccessToken;
    }

    placesBounds: Bounds;
    initialized = false;

    private _places: Array<AreaOfInterest> = [];
    private map: MapboxView;
    private logger: Logger;

    constructor() {
        this.logger = getLogger("PlacesMapComponent");
    }

    onMapReady(args: EventData) {
        this.map = args.object as MapboxView;
        this.initMap()
            .then(() => (this.initialized = true))
            .catch((err) => {
                this.logger.error(`Could not init map. Reason: ${err}`);
                this.initialized = false;
            });
    }

    onZoomOutTapped() {
        this.highlightedPlace = undefined;
    }

    private async reInitMap() {
        if (!this.map) throw new Error("No map reference!");
        if (this.initialized) {
            await this.map.removeLayer(PLACES_LAYER_ID);
            await this.map.removeSource(PLACES_LAYER_ID);
        }
        await this.initMap();
    }

    private async initMap() {
        if (!this.map) throw new Error("No map reference!");
        if (!this._places || this._places.length === 0)
            throw new Error("Places list is undefined or empty!");

        const placesFeatureCollection = this.getPlacesFeatureCollection();
        await this.addPlacesSource(placesFeatureCollection);

        await this.addPlacesLayer();

        this.updatePlacesBBox(placesFeatureCollection);
        await this.centerViewport();
    }

    private getPlacesFeatureCollection(): FeatureCollection {
        const placesFeatures: Array<Feature> = [];
        for (const place of this._places) {
            placesFeatures.push(placeToFeature(place));
        }

        return featureCollection(placesFeatures);
    }

    private async addPlacesSource(places: FeatureCollection) {
        await this.map.addSource(PLACES_LAYER_ID, {
            type: "geojson",
            data: places,
        });
    }

    private async addPlacesLayer() {
        await this.map.addLayer({
            id: PLACES_LAYER_ID,
            type: "fill",
            source: PLACES_LAYER_ID,
            layout: {
                "fill-opacity": FILL_OPACITY,
            },
            paint: {
                "fill-color": FILL_COLOR,
            },
        });
    }

    private updatePlacesBBox(places: FeatureCollection) {
        this.placesBounds = getBoundsForGeoJSON(places);
    }

    private async centerViewport(animated = false, place?: AreaOfInterest) {
        const bounds = place
            ? getBoundsForGeoJSON(placeToFeature(place))
            : this.placesBounds;
        await this.map.setViewport({
            bounds,
            padding: MAP_VIEWPORT_PADDING,
            animated,
        });
    }
}

function placeToFeature(place: AreaOfInterest): Feature {
    const placeCenter = point([place.longitude, place.latitude]);

    return buffer(placeCenter, place.radius / 1000);
}

function getBoundsForGeoJSON(geojson: any): Bounds {
    const [minX, minY, maxX, maxY] = bbox(geojson);

    return {
        north: maxY,
        east: maxX,
        south: minY,
        west: minX,
    };
}
