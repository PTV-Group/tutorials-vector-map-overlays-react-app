import "./OverlayControl.css"
import React, { useEffect, useState } from 'react'

const OverlayControl = (props) => {

  const [trafficPatternsChecked, setTrafficPatternsChecked] = useState(false);
  const [truckRestrictionsChecked, setTruckRestrictionsChecked] = useState(false);
  const [lowEmissionZonesChecked, setLowEmissionZonesChecked] = useState(false);
  const [tollRoadsChecked, setTollRoadsChecked] = useState(false);


  useEffect(() => {
    const overlays = [];
    if (trafficPatternsChecked) {
      overlays.push("traffic-patterns");
    }
    if (truckRestrictionsChecked) {
      overlays.push("truck-restrictions");
    }
    if (lowEmissionZonesChecked) {
      overlays.push("low-emission-zones");
    }
    if(tollRoadsChecked) {
      overlays.push("toll");
    }
    props.onChange(overlays);
  },[trafficPatternsChecked, truckRestrictionsChecked, lowEmissionZonesChecked, tollRoadsChecked]);

  return (
    <div className="control-panel overlay-control">
      <div>
        <input type="checkbox" 
          checked={trafficPatternsChecked}
          onChange={() => setTrafficPatternsChecked(!trafficPatternsChecked)}
        />
        <label>Traffic Patterns</label>
      </div>
      <div>
        <input type="checkbox" 
          checked={truckRestrictionsChecked}
          onChange={() => setTruckRestrictionsChecked(!truckRestrictionsChecked)}
        />
        <label>Truck Restrictions</label>
      </div>
      <div>
        <input type="checkbox" 
          checked={lowEmissionZonesChecked}
          onChange={() => setLowEmissionZonesChecked(!lowEmissionZonesChecked)}
        />
        <label>Low Emission Zones</label>
      </div>
      <div>
        <input type="checkbox" 
          checked={tollRoadsChecked}
          onChange={() => setTollRoadsChecked(!tollRoadsChecked)}
        />
        <label>Toll Roads</label>
      </div>
    </div>
  )
}
export default OverlayControl