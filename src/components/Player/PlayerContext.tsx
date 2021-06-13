import { createContext, ReactNode, useContext, useState } from "react";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasNext: boolean;
  hasPrev: boolean;
  play: (episode: Episode) => void;
  setPlayingState: (state: boolean) => void;
  playList: (list: Episode[], index: number) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  playPrev: () => void;
  playNext: () => void;
  clearPlayerState: () => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
};

export function PlayerContextProvider({
  children,
}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const hasPrev = currentEpisodeIndex == 0 && !isShuffling;
  const hasNext = currentEpisodeIndex == episodeList.length - 1 && !isShuffling;

  function play(episode: Episode): void {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number): void {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay(): void {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop(): void {
    setIsLooping(!isLooping);
  }

  function toggleShuffle(): void {
    setIsShuffling(!isShuffling);
  }

  function playPrev(): void {
    if (isShuffling) {
      const randomIndex = Math.floor(Math.random() * episodeList.length);

      setCurrentEpisodeIndex(randomIndex);
    } else {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  function playNext(): void {
    if (isShuffling) {
      const randomIndex = Math.floor(Math.random() * episodeList.length);

      setCurrentEpisodeIndex(randomIndex);
    } else {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function setPlayingState(state: boolean): void {
    setIsPlaying(state);
  }

  function clearPlayerState(): void {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        hasPrev,
        hasNext,
        isPlaying,
        isLooping,
        isShuffling,
        play,
        setPlayingState,
        playList,
        playPrev,
        playNext,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        clearPlayerState,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  return useContext(PlayerContext);
};
