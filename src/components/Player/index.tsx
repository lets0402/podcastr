import Image from "next/image";
import React from "react";
import { usePlayer } from "./PlayerContext";
import styles from "./styles.module.scss";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

export default function Player() {
  const {
    episodeList,
    currentEpisodeIndex,
    hasPrev,
    hasNext,
    isLooping,
    isPlaying,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    playPrev,
    playNext,
    clearPlayerState,
  } = usePlayer();
  const episode = episodeList[currentEpisodeIndex];
  const [progress, setProgress] = React.useState(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }
  function handleEnded() {
    if (!hasNext) {
      playNext();
    } else {
      clearPlayerState();
      setProgress(0);
    }
  }

  return (
    <div className="playerContainer">
      <header>
        <img src="/playing.svg" alt="Tocando Agora"></img>
        <strong>Tocando Agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={150}
            height={150}
            src={episode.thumbnail}
            alt={episode.title}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#04d361", borderWidth: 3 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>
            {convertDurationToTimeString((episode?.duration ?? 0) - progress)}
          </span>
          {episode && (
            <audio
              src={episode.url}
              ref={audioRef}
              autoPlay
              onPlay={() => setPlayingState(true)}
              onPause={() => setPlayingState(false)}
              onEnded={handleEnded}
              onLoadedMetadata={() => setupProgressListener()}
              loop={isLooping}
            />
          )}
        </div>
        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length == 1}
            className={isShuffling ? styles.isActive : ""}
            onClick={toggleShuffle}
          >
            <img src="/shuffle.svg" alt="Embaralhar"></img>
          </button>
          <button
            type="button"
            disabled={!episode || hasPrev}
            onClick={playPrev}
          >
            <img src="/play-previous.svg" alt="Tocar anterior"></img>
          </button>
          <button
            onClick={togglePlay}
            type="button"
            className={styles.playButton}
            disabled={!episode}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Tocar"></img>
            ) : (
              <img src="/play.svg" alt="Tocar"></img>
            )}
          </button>
          <button
            type="button"
            disabled={!episode || hasNext}
            onClick={playNext}
          >
            <img src="/play-next.svg" alt="Tocar próximo"></img>
          </button>
          <button
            className={isLooping ? styles.isActive : ""}
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
          >
            <img src="/repeat.svg" alt="Repetir"></img>
          </button>
        </div>
      </footer>
    </div>
  );
}
