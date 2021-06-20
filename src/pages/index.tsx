import { GetStaticProps } from "next";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import { PlayerContext } from "../components/Player/PlayerContext";
import { useContext } from "react";
import Head from "next/head";
import api from "../services/api";
import axios from "axios";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  published_at: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
};

type HomeProps = {
  lastestEpisodes: Episode[];
  allEpisodes: Episode[];
};
export default function Home({ lastestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = useContext(PlayerContext);
  const episodeList = [...lastestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={styles.lastestEpisodes}>
        <h2>Últimos Episódios</h2>
        <ul>
          {lastestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <div className={styles.imageThumbnail}>
                  <Image
                    width={192}
                    height={192}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                    layout="responsive"
                  />
                </div>
                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.published_at}</span>
                  <span>{episode.durationAsString}</span>
                  <button
                    type="button"
                    onClick={() => playList(episodeList, index)}
                  >
                    <img src="/play-green.svg" alt="Tocar episódio"></img>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos os Episódios</h2>

        <table cellPadding={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 100 }}>
                    <Image
                      width={192}
                      height={192}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.published_at}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        playList(episodeList, index + lastestEpisodes.length)
                      }
                    >
                      <img src="/play-green.svg" alt="Tocar episódio"></img>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await axios.get("/episodes", {
    params: { _limit: 12, _sort: "published_at", _order: "desc" },
  });

  const episodes = data.episodes.map((episode) => {
    //const episodes = response.data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      published_at: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      description: episode.description,
      url: episode.file.url,
    };
  });

  const lastestEpisodes = episodes.splice(0, 2);
  const allEpisodes = episodes.splice(2, episodes.length);

  return {
    props: {
      lastestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
