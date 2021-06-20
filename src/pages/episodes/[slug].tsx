import axios from "axios";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "../../components/Player/PlayerContext";
import api from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import styles from "./styles.module.scss";

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

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer();
  return (
    <div className={styles.episode}>
      <Head>
        <title>Episódio | {episode?.title}</title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar"></img>
          </button>
        </Link>
        {episode && (
          <Image
            width={800}
            height={260}
            src={episode?.thumbnail}
            alt={episode?.title}
            objectFit="cover"
          />
        )}
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episódio"></img>
        </button>
      </div>
      <div className={styles.header}>
        <h1>{episode?.title}</h1>
        <span>{episode?.members}</span>
        <span>{episode?.published_at}</span>
        <span>{episode?.durationAsString}</span>
      </div>
      {episode && (
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: `${episode?.description}` }}
        />
      )}
    </div>
  );
}
export const getStaticPaths: GetStaticPaths = async () => {
  // const { data } = await api.get("/api/episodes", {
  //   params: { _limit: 2, _sort: "published_at", _order: "desc" },
  // });
  const data = await import("../../../server.json");
  const paths = data.episodes.map((episode: { id: any }) => {
    return { params: { slug: episode.id } };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  // const { data } = await api.get(`/api/episodes/?id=${slug}`);
  const data = await import("../../../server.json");
  const item = data.episodes.find((e) => e.id === slug);

  const episode = {
    id: item?.id,
    title: item?.title,
    thumbnail: item?.thumbnail,
    members: item?.members,
    published_at: item?.published_at
      ? format(parseISO(item?.published_at), "d MMM yy", {
          locale: ptBR,
        })
      : null,
    duration: Number(item?.file?.duration),
    durationAsString: convertDurationToTimeString(Number(item?.file?.duration)),
    description: item?.description,
    url: item?.file?.url,
  };

  return {
    props: { episode: episode },
    revalidate: 60 * 60 * 24,
  };
};
