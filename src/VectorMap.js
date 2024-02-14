import { useCallback, useRef, useState } from "react";
import { Map, NavigationControl, Popup } from "react-map-gl/maplibre";

// Use the standard map style with truck restrictions provided by PTV.
const MAP_STYLE_URL = "https://vectormaps-resources.myptv.com/styles/latest/standard-truck-restrictions.json";

// There are different icons for north american countries, so we have different layers to handle.
const TRUCK_RESTRICTION_ICON_LAYERS = ["TSP_TruckRestrictions_Shield_HERE", 
  "TSP_TruckRestrictions_Shield_HERE_USA", 
  "TSP_TruckRestrictions_Shield_HERE_CAN",
  "TSP_TruckRestrictions_Shield_HERE_MEX"];

//The initial view is Karlsruhe, Germany.
const INITIAL_VIEW_PORT = {
  longitude: 8.4055677,
  latitude: 49.0070036,
  zoom: 12,
  pitch: 0,
  bearing: 0,
};

export const VectorMap = (props) => {
  const mapRef = useRef(null);
  const [popupInfo, setPopupInfo] = useState(null);

  const getTransformRequest = useCallback(
    (url, resourceType) => {
      if (resourceType === "Tile") {
        return { url: url, headers: { ApiKey: " " + props.apiKey } };
      }
      return { url: url, headers: {} };
    }, []
  );

  const initializeEvents = () => {
    const map = mapRef.current?.getMap();
    TRUCK_RESTRICTION_ICON_LAYERS.forEach((layer) => {
      map?.on("mouseenter", layer, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map?.on("mouseleave", layer, () => {
        map.getCanvas().style.cursor = "";
      });
      map?.on("click", layer, (event) => {
        if (event?.features) {
          const structuredDescriptions =
            event?.features[0].properties.structured_descriptions;
          const descriptions = JSON.parse(structuredDescriptions);
          setPopupInfo({
            lnglat: event.lngLat,
            description: descriptions,
          });
        }
      });
    });
  };

  return (
    <Map
      ref={mapRef}
      height="100%"
      width="100%"
      mapStyle={MAP_STYLE_URL}
      initialViewState={INITIAL_VIEW_PORT}
      transformRequest={(url, resourceType) => getTransformRequest(url, resourceType)}
      onLoad={() => initializeEvents()}
    >
      {!!popupInfo && (
        <Popup
          anchor="top"
          maxWidth="500px"
          longitude={Number(popupInfo.lnglat.lng)}
          latitude={Number(popupInfo.lnglat.lat)}
          onClose={() => setPopupInfo(null)}
        >
          {popupInfo.description.map(
            (entry) => (
              // Each structured description is a JSON object
              //   with a description and an optional array of time-domain descriptions
              <p>
                <b>{entry.description}</b>
                {entry.time_domain_descriptions?.map(
                  (time_domain) => (
                    <i>{time_domain}</i>
                  ),
                )}
              </p>
            ),
          )}
        </Popup>
      )}
      <NavigationControl position="bottom-right" />
    </Map>
  );
}
