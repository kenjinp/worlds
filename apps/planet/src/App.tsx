import "./App.css";
import BasicScene from "./components/BasicScene";
import { PlanetGenerator } from "./components/planet/PlanetGenerator";

import { OrbitControls } from "@react-three/drei";
import { Leva } from "leva";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Container } from "./components/container/Container";
import CultureGenerator from "./components/cultures/CultureGenerator";
import Demographics from "./components/demographics/Demographics";
import Footer from "./components/footer/Footer";
import States from "./components/states/States";

function App() {
  return (
    <div className="App">
      <Footer />
      <Leva collapsed hidden />
      <CultureGenerator />
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
      <Container
        style={{
          zIndex: 2,
          position: "absolute",
        }}
      >
        <Tabs defaultIndex={2}>
          <TabList>
            <Tab>Planet</Tab>
            <Tab>Cultures</Tab>
            <Tab>States</Tab>
            <Tab>Demographics</Tab>
            <Tab>Languages</Tab>
            <Tab>Debug</Tab>
          </TabList>
          <TabPanel>
            <h2>Planet</h2>
            <p>todo: add configurations here</p>
          </TabPanel>
          <TabPanel>
            <h2>Cultures</h2>
            <p>todo: create cultural tree here</p>
          </TabPanel>
          <TabPanel>
            <h2>States</h2>
            <p>From most prosperous to diminished</p>
            <States />
          </TabPanel>
          <TabPanel>
            <h2>Demographics</h2>
            <Demographics />
          </TabPanel>
          <TabPanel>
            <h2>Languages</h2>
            <p>todo: create language tree here</p>
          </TabPanel>
          <TabPanel>
            <h2>Debug</h2>
            <p>todo: Debug stuff goes here</p>
          </TabPanel>
        </Tabs>
      </Container>
    </div>
  );
}

export default App;
