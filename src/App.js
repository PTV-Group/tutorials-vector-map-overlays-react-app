import "maplibre-gl/dist/maplibre-gl.css";

import { VectorMap } from "./VectorMap";

const API_KEY = "YOUR_API_KEY";

const WRAPPER_STYLE = {
  position: "absolute",
  gridArea: "map",
  height: "100%",
  width: "100%",
  zIndex: 0
};

const App = () => (
  <div style={WRAPPER_STYLE}>
    <VectorMap apiKey={API_KEY}/>
  </div>
);

export default App;
