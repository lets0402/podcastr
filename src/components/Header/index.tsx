import React from "react";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import Link from "next/link";

export default function Header() {
  const currentDate = format(new Date(), "EEEEEE, d MMMM", {
    locale: ptBR,
  });
  return (
    <header className="headerContainer">
      <Link href="/">
        <a>
          <img src="/logo.svg" alt="podcastr" />
        </a>
      </Link>

      <p>O melhor para ouvir, sempre</p>
      <span>{currentDate}</span>
    </header>
  );
}
