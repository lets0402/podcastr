import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "../../components/Player/PlayerContext";
import { api } from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import styles from "./styles.module.scss";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  published_at: string;
  duration: Number;
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
        <title>Episódio | {episode.title}</title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar"></img>
          </button>
        </Link>
        <Image
          width={800}
          height={260}
          src={episode.thumbnail}
          alt={episode.title}
          objectFit="cover"
        />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episódio"></img>
        </button>
      </div>
      <div className={styles.header}>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.published_at}</span>
        <span>{episode.durationAsString}</span>
      </div>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: `${episode.description}` }}
      />
    </div>
  );
}
export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get("episodes", {
    params: { _limit: 2, _sort: "published_at", _order: "desc" },
  });

  const paths = data.map((episode) => {
    return { params: { slug: episode.id } };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    published_at: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: { episode },
    revalidate: 60 * 60 * 24,
  };
};
