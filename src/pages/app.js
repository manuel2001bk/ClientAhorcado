import React from 'react'
import update from "immutability-helper";
import css from '../assets/css/app.css'
import imagen1 from '../assets/img/horcado1.png'
import imagen2 from '../assets/img/horcado2.png'
import imagen3 from '../assets/img/horcado3.png'
import imagen4 from '../assets/img/horcado4.png'
import imagen5 from '../assets/img/horcado5.png'



import { io } from "socket.io-client";



class App extends React.Component {
    constructor() {
        super();
        this.state = {
            palabra : "",
            palabraConGuiones : '',
            letra : "",
            fallos : 1
        }
        this.socket = io("ws://localhost:3000")
        this.imagenes = [imagen1,imagen2,imagen3,imagen4,imagen5]
    }
    changeField(e) {
        let field = e.target.name
        let value = e.target.value

        this.setState(update(this.state, {
            [field] : {$set : value}
        }))
    }

    ingresarletra(e){
        String.prototype.replaceAt = function(index, character) {
            return this.substr(0, index) + character + this.substr(index+character.length);
        }
        if(this.state.fallos != 5){
            var fallo = true;
            for (const i in this.state.palabra){
                if(this.state.letra == this.state.palabra[i]){
                    //alert("exito")
                    this.state.palabraConGuiones = this.state.palabraConGuiones.replaceAt(i*2, this.state.letra);
                    this.palabraGuiones.innerHTML = this.state.palabraConGuiones
                    fallo = false;
                }
            }
            if(fallo){
                this.imagen.src = this.imagenes[this.state.fallos]
                this.state.fallos = this.state.fallos+1
            }
            console.log(this.state.fallos)
            //console.log(this.state.palabraConGuiones)
        }else{
            alert('Juego terminado')
        }
    }
    iniciarJuego(e){
        if(this.state.palabra.length == '' ){
            this.socket.emit('getPalabra', 'Servidor echo');

            this.socket.on('Server:palabra', (data) => {
                this.state.palabra = data;
                this.state.palabraConGuiones = this.state.palabra.replace(/./g,"_ ")
                this.palabraGuiones.innerHTML = this.state.palabraConGuiones
            });
        }
    }

    render(){
        return (

            <div className="body-game">
                <h1>Bienvenido al juego del Horcado.</h1>
                <div  className="card">
                    <div className="carta">
                        <h5>Presione el boton de iniciar y después introduzca una letra para ver si existe.</h5>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button id="iniciarJuego"
                                    onClick={this.iniciarJuego.bind(this)}>Iniciar</button>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-4">
                                <div className="inputLetra" id="TextArea">
                                    <div className="form-floating mb-3">
                                        <input id="letra"
                                               name="letra"
                                               type="text"
                                               className="form-control"
                                               placeholder="Letra a buscar"
                                               value={this.state.label}
                                               onChange={this.changeField.bind(this)}
                                               maxLength="1"/>
                                        <label htmlFor="floatingInput">Letra a Buscar</label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <h2 ref={self => this.palabraGuiones = self}></h2>
                            </div>
                        </div>
                        <div>
                            <button id="IngresarLetra"
                                    className="btn btn-outline-primary"
                                    onClick={this.ingresarletra.bind(this)}>Ingresar Letra</button>
                        </div>
                        <div className="imagenHorcado">
                            <img id="imagenHorcado"
                                 ref={self => this.imagen = self}
                                 src={imagen1}
                                 className="card-img-top"/>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default  App;