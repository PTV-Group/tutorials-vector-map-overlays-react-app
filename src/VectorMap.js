import { useCallback, useRef, useState } from "react";
import { Map, NavigationControl, Popup } from "react-map-gl/maplibre";
import OverlayControl from "./OverlayControl";

//Use the standard map style with invisible overlays provided by PTV.
const MAP_STYLE_URL = "https://vectormaps-resources.myptv.com/styles/latest/standard.json";


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
      let requiredUrl = url || "";
      if (resourceType && resourceType === "Tile") {
        //Add current time as reference time 
        if (url?.includes("trafficPatterns")) {
          requiredUrl += "&referenceTime=" + new Date().toISOString();
        }
        return {
          url: requiredUrl,
          headers: { ApiKey: " " + props.apiKey },
        };
      }
      return { url: requiredUrl, headers: {} };
    }, []
  );

  const initializeEvents = () => {
    const map = mapRef.current?.getMap();
    map?.getStyle().layers.forEach((layer) => {
      if (layer.metadata && layer.metadata["ptv:layer-group"] === "truck-restrictions") {
        map?.on("mouseenter", layer.id, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map?.on("mouseleave", layer.id, () => {
          map.getCanvas().style.cursor = "";
        });
        map?.on("click", layer.id, (event) => {
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
      }
    });
  };

  const updateOverlays = (overlays) => {
    const map = mapRef.current?.getMap();
    const style = map?.getStyle();
    style?.layers.forEach( (layer) => {
      if (layer.metadata) {
        //Use the layer-group to set all layers that included in overlays array to visible
        map.setLayoutProperty(layer.id, 
          'visibility', 
          overlays.includes(layer.metadata["ptv:layer-group"]) ? "visible" : "none");
      }
    });
  };

  return (
    <>
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
              // For truck restrictions each structured description is a JSON object
              // with a description and an optional array of time-domain descriptions
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
    <OverlayControl onChange={updateOverlays}/>
  </>
  );
}
