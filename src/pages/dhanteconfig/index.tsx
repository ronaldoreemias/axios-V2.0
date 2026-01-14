import style from "./Dante.module.css";
import { useState } from "react";
import Apagar from "../../Components/Lixudospostes";

export default function Cms() {
  const [texto, setTexto] = useState("");
  const [link, setLink] = useState("");
  const [autor, setAutor] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleTexto = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTexto(e.target.value);
  };

  const handleLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleAutor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutor(e.target.value);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("texto", texto);
    formData.append("link", link);
    formData.append("autor", autor);

    if (file) {
      formData.append("file", file);
    }

    alert("Atualizando: " + texto);
  };

  return (
    <form onSubmit={handleSubmit} className={style.formulariocomfoto}>
      <div className={style.P_do_forme}>
        <p>Formulario de postagem com foto</p>
      </div>

      <div>
        <p>o que deseja escrever :</p>
        <textarea value={texto} onChange={handleTexto} />
      </div>

      <div>
        <p>link de onde buscou a informação</p>
        <input type="text" value={link} onChange={handleLink} />
      </div>

      <div>
        <p>Nome do autor</p>
        <input type="text" value={autor} onChange={handleAutor} />
      </div>

      <div>
        <p>escolha uma foto para sua postagem</p>
        <input type="file" onChange={handleFile} />
      </div>

      <input type="submit" value="enviar" />
      <Apagar />
    </form>
  );
}
