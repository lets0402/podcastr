import { useState } from "react";
import Header from "../components/Header";
import Player from "../components/Player";
import { PlayerContextProvider } from "../components/Player/PlayerContext";
import "../styles/theme.scss";
function MyApp({ Component, pageProps }) {
  return (
    <PlayerContextProvider>
      <div className="appWrapper">
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  );
}
export default MyApp;
