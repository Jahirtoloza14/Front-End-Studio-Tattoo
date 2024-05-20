import { useNavigate } from "react-router-dom";
import { CustomInput } from "../../components/Custominput";
import { ButtonC } from "../../components/ButtonC/ButtonC";
import "./Login.css"
import { useState, useEffect } from "react"
import { loginCall } from "../../services/apiCalls";
import { decodeToken } from "react-jwt";
import { useDispatch } from "react-redux";
import { login } from "../userSlice";

export const Login = () => {
    const navigate = useNavigate()
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    })
    const [msg, setMsg] = useState("")
    
    const dispatch = useDispatch()

    const loginMe =  async() => {
        // esta sera la funcion que desencadenara el login
        
        const anwser = await loginCall(credentials)

        if (anwser.data.token) {
            // decodificamos el token
            const uDecodificado = decodeToken(anwser.data.token);

            const passport = {
                token: anwser.data.token,
                decodificado: uDecodificado

            }
            dispatch(login(passport))


            console.log(passport)
            // guardariamos passport
            sessionStorage.setItem("passport", JSON.stringify(passport))
            setMsg(`${uDecodificado.name}, bienvenid@ de nuevo`)

            setTimeout(() => {
                navigate("/profile",{state: passport} )
            }, 3000)
        }
    }
    const inputHandler = (e) => {
        //genero la funcion que bindea

        setCredentials(
            (prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            })
        )
    }

    return (
        <div className="login-container loginElementDesign">
            {msg === "" ? <>

            <CustomInput
                typeProp={"email"}
                nameProp={"email"}
                handlerProp={(e) => inputHandler(e)}
                placeholderProp={"escribe tu e-mail"}
            />

            <CustomInput
                typeProp={"password"}
                nameProp={"password"}
                handlerProp={(e) => inputHandler(e)}
                placeholderProp={"escribe el password"}
            />
            <ButtonC
                title={"log me"}
                className={"regularButtonClass"}
                functionEmit={loginMe}
            />
            </> : <div>{msg}</div>}
            {<pre>{JSON.stringify(credentials,null,2)}</pre>}

           
        </div>
    )
}