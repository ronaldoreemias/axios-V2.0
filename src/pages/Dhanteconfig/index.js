import style from "./Dante.module.css";
import Navbar from "../../Components/Navbar";
import React, { useState } from "react";


class PostagemcomFotonoBlog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      texto: '',
      link: '',
      autor: '',
      file: null
    };

    this.handleFile = this.handleFile.bind(this);
    this.handleAutor = this.handleAutor.bind(this);
    this.handleLink = this.handleLink.bind(this);
    this.handleTexto = this.handleTexto.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFile(event) {
    this.setState({ file: event.target.files[0] });
  }

  handleTexto(event) {
    this.setState({ texto: event.target.value });
  }

  handleLink(event) {
    this.setState({ link: event.target.value });
  }

  handleAutor(event) {
    this.setState({ autor: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', this.state.file);
    formData.append('texto', this.state.texto);
    formData.append('link', this.state.link);
    formData.append('autor', this.state.autor);

    alert('Atualizando: ' + this.state.texto);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className={style.formulariocomfoto}>
            <div className={style.P_do_forme}>
                <p>Formulario de postagem com foto</p>
            </div>
        
            <div>
                <p>o que deseja escrever :</p>
                <textarea value={this.state.texto} onChange={this.handleTexto} />
            </div>
        
            <div>
                <p>link de onde buscou a informação</p>
                <input type="text" value={this.state.link} onChange={this.handleLink} />
            </div>
        
            <div>
                <p>Nome do autor</p>
                <input type="text" value={this.state.autor} onChange={this.handleAutor} />
            </div>
            <div>
                <p>escolha uma foto para sua postagem</p>
                <input type="file" name="file" onChange={this.handleFile} />
            </div>        
        <input type="submit" value="enviar" />
      </form>
    );
  }
}


class PostagemnoBlog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      texto: '',
      link: '',
      autor: ''
    };

    this.handleAutor = this.handleAutor.bind(this);
    this.handleLink = this.handleLink.bind(this);
    this.handleTexto = this.handleTexto.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleTexto(event) {
    this.setState({ texto: event.target.value });
  }

  handleLink(event) {
    this.setState({ link: event.target.value });
  }

  handleAutor(event) {
    this.setState({ autor: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('texto', this.state.texto);
    formData.append('link', this.state.link);
    formData.append('autor', this.state.autor);

    alert('Atualizando: ' + this.state.texto);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className={style.formulariosemfoto}>
        <div className={style.P_do_forme}>
          <p>Formulario de postagem sem foto</p>
        </div>
        
            <div>
                <p>o que deseja escrever :</p>
                <textarea value={this.state.texto} onChange={this.handleTexto} />
            </div>
        
          <div>
            <p>link de onde buscou a informação</p>
            <input type="text" value={this.state.link} onChange={this.handleLink} />
          </div>
        
        <div>
            <p>Nome do autor</p>
            <input type="text" value={this.state.autor} onChange={this.handleAutor} />
        </div>
        <input type="submit" value="enviar" />
      </form>
    );
  }
}


function Cms(){
    return (
        
        <div className={style.painelConstrole}>
            <Navbar />
            <br/>
            <br/>
            <br/>
            <div className={style.contanderform}>
                <PostagemcomFotonoBlog />
                <PostagemnoBlog />
            </div>
            <br/>
            
            <br/>

        </div>
    );
}

export default Cms;