import "./OverlayControl.css"
import React, { useEffect, useState } from 'react'

const OverlayControl = (props) => {

  const [trafficPatternsChecked, setTrafficPatternsChecked] = useState(false);
  const [truckRestrictionsChecked, setTruckRestrictionsChecked] = useState(false);
  const [lowEmissionZonesChecked, setLowEmissionZonesChecked] = useState(false);

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
    props.onChange(overlays);
  },[trafficPatternsChecked, truckRestrictionsChecked, lowEmissionZonesChecked]);

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
    </div>
  )
}
export default OverlayControl