import { useEffect, useState } from "react";
import style from "./DestaqueVagas.module.css";

interface Vagas {
  Vaga: string;
  Descrição?: string;
  Local?: string;
  link_site_da_empresa?: string;
}

const DestaqueVagas = () => {
  const [vagas, setVagas] = useState<Vagas[]>([]);

  useEffect(() => {
    fetch("/Dbjason/Vagas.json")
      .then((response) => response.json())
      .then((dados: Vagas[]) => {
        setVagas(dados);
      })
      .catch((error) => {
        console.error("Erro ao carregar vagas:", error);
      });
  }, []);

  const ultimasVagas = vagas.slice(0, 4);

  return (
    <div className={style.container}>
      {ultimasVagas.map((vaga, index) => (
        <div key={index} className={style.card}>
          <h3 className={style.titulo}>{vaga.Vaga}</h3>

          {vaga.Descrição && (
            <p className={style.descricao}>{vaga.Descrição}</p>
          )}

          <p className={style.local}>
            {vaga.Local || "Local não informado"}
          </p>

          {vaga.link_site_da_empresa && (
            <a
              href={vaga.link_site_da_empresa}
              target="_blank"
              rel="noopener noreferrer"
              className={style.link}
            >
              Ver mais →
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default DestaqueVagas;