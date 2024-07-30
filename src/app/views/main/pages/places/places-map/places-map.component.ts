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
import {
    AdvancedSetting,
    advancedSettings,
} from "~/app/core/account/advanced-settings";
import { ExtendedAreaOfInterest } from "~/app/core/account";

const PLACES_LAYER_ID = "places";
const PLACES_BORDER_LAYER_ID = "places-border";
const PLACES_FILL_COLOR = "#1F525E";
const PLACES_FILL_OPACITY = 0.6;
const PLACES_BORDERS_FILL_COLOR = "#F5D854";
const PLACES_BORDERS_FILL_OPACITY = 0.3;

@Component({
    selector: "SymPlacesMap",
    templateUrl: "./places-map.component.html",
    styleUrls: ["./places-map.component.scss"],
})
export class PlacesMapComponent {
    @Input()
    set places(places: Array<ExtendedAreaOfInterest>) {
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
            await this.map.removeLayer(PLACES_BORDER_LAYER_ID);

            await this.map.removeSource(PLACES_LAYER_ID);
            await this.map.removeSource(PLACES_BORDER_LAYER_ID);
        }
        await this.initMap();
    }

    private async initMap() {
        if (!this.map) throw new Error("No map reference!");
        if (!this._places || this._places.length === 0)
            throw new Error("Places list is undefined or empty!");

        const { placesFeatureCollection, bordersFeatureCollection } =
            this.getPlacesFeatureCollections();

        await this.addPlacesSource(placesFeatureCollection);
        await this.addPlacesBorderSource(bordersFeatureCollection);

        await this.addPlacesBorderLayer();
        await this.addPlacesLayer();

        this.updatePlacesBBox(placesFeatureCollection);
        await this.centerViewport();
    }

    private getPlacesFeatureCollections(): {
        placesFeatureCollection: FeatureCollection;
        bordersFeatureCollection: FeatureCollection;
    } {
        const placesFeatures: Array<Feature> = [];
        const borderFeatures: Array<Feature> = [];
        for (const place of this._places) {
            const { areaFeature, borderFeature } = placeToFeature(place);
            placesFeatures.push(areaFeature);
            borderFeatures.push(borderFeature);
        }

        return {
            placesFeatureCollection: featureCollection(placesFeatures),
            bordersFeatureCollection: featureCollection(borderFeatures),
        };
    }

    private async addPlacesSource(places: FeatureCollection) {
        await this.map.addSource(PLACES_LAYER_ID, {
            type: "geojson",
            data: places,
        });
    }

    private async addPlacesBorderSource(borders: FeatureCollection) {
        await this.map.addSource(PLACES_BORDER_LAYER_ID, {
            type: "geojson",
            data: borders,
        });
    }

    private async addPlacesLayer() {
        await this.map.addLayer({
            id: PLACES_LAYER_ID,
            type: "fill",
            source: PLACES_LAYER_ID,
            layout: {
                "fill-opacity": PLACES_FILL_OPACITY,
            },
            paint: {
                "fill-color": PLACES_FILL_COLOR,
            },
        });
    }

    private async addPlacesBorderLayer() {
        await this.map.addLayer({
            id: PLACES_BORDER_LAYER_ID,
            type: "fill",
            source: PLACES_BORDER_LAYER_ID,
            layout: {
                "fill-opacity": PLACES_BORDERS_FILL_OPACITY,
            },
            paint: {
                "fill-color": PLACES_BORDERS_FILL_COLOR,
            },
        });
    }

    private updatePlacesBBox(places: FeatureCollection) {
        this.placesBounds = getBoundsForGeoJSON(places);
    }

    private async centerViewport(animated = false, place?: AreaOfInterest) {
        const bounds = place
            ? getBoundsForGeoJSON(placeToFeature(place).borderFeature)
            : this.placesBounds;
        const outerRadius = advancedSettings.getNumber(
            AdvancedSetting.NearbyExposureRadius
        );
        await this.map.setViewport({
            bounds,
            padding: outerRadius,
            animated,
        });
    }
}

function placeToFeature(place: AreaOfInterest): {
    areaFeature: Feature;
    borderFeature: Feature;
} {
    const placeCenter = point([place.longitude, place.latitude]);
    const areaFeature = buffer(placeCenter, place.radius / 1000);
    const outerRadius = advancedSettings.getNumber(
        AdvancedSetting.NearbyExposureRadius
    );
    const borderFeature = buffer(
        placeCenter,
        (place.radius + outerRadius) / 1000
    );

    return {
        areaFeature,
        borderFeature,
    };
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
