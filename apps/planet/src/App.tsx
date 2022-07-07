import { OrbitControls } from "@react-three/drei";
import { Leva } from "leva";
import "./App.css";
import BasicScene from "./components/BasicScene";
import { PlanetGenerator } from "./components/planet/PlanetGenerator";
import { useStore } from "./store";
function App() {
  const state = useStore();

  return (
    <div className="App">
      <Leva collapsed />
      <BasicScene>
        {/* {state.playerSpawnPositions.map((pos, index) => {
          console.log("spawn position", pos);
          return <PlayerPhysicsSystem key={index} startingPosition={pos} />;
        })} */}
        <PlanetGenerator />
        {/* <FloatingOriginScene><OrbitControls /></FloatingOriginScene> */}
        {/* <FlyControls /> */}
        {/* <PlayerSpawner /> */}
        {/* <RenderPlayers /> */}
        {/* <FlyCamera /> */}
        <OrbitControls />
      </BasicScene>
      <div
        id="actions"
        style={{ position: "absolute", left: "1em", bottom: "1em" }}
      >
        {/* <button>Spawn Player</button>
        <CameraButtons /> */}
        <div id="spawner"></div>
      </div>
    </div>
  );
}

export default App;