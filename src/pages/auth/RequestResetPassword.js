import React,{useState,useEffect} from "react";
import {useNavigate,Link} from "react-router-dom";
import {texts} from "../texts/Texts";
import {sendRequestResetEmail} from "./FirebaseConfig";
import {MinLoder,Toast,Exclamation,PasswordViewer,authErros} from "../Utils";

const RequestResetPassword =({lang})=>{
  const navigate = useNavigate();
  const [loading,setLoading]= useState(false);
  const [datas,setDatas]=useState({email:""});
  const [error,setError] = useState({email:null,error:null});
  
  const handleChange =(event)=>{
    const field = event.target.name;
    const value = event.target.value;
    setDatas(prevData=>({...prevData,[field]:value}));
  } // em cada input em digitação atualiza o valor no state
  
  useEffect(()=>{
  },[lang]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = new Array();
    if(!datas.email.match(/^[a-zA-Z][a-zA-Z0-9\-\_\.]+@[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}$/)){
      setError(prevError=>({...prevError,email:texts.invalidEmail[lang]}));
      errors.push(1);
    }
    if(errors.length <= 0){
      setLoading(true);
     handleSignIn();
    }
  } // verificação de formulário
  
  async function handleSignIn(){
    try{
      await sendRequestResetEmail(datas.email);
      setError(prevError=>({...prevError,error:texts.requestSent[lang]}));
    }catch(error){
      for(let i = 0; i < authErros.length; i++){
        if(error.code === authErros[i].name){
          let errorMessage = texts[authErros[i].target][lang]; // exemplo:texts.invalidPassword.ptPT retona "Senha inválido!"
          setError(prevError=>({...prevError,error:errorMessage}));
        }
      }
    }finally{
      setLoading(false);
    }
  }
  
  const handleClearError = (event)=>{
    const field = event.target.name;
    setError(prevError=>({...prevError,[field]:null}));
  } // limpar os erros renderizados pelos inputs vazios ou inválidos
  
  return(
    <section className="sec_1 flex_c_c pg_10">
      <Toast props={error.error} onClear={()=>setError(prevError=>({...prevError,error:null}))}/>
      <div className="w100 flex_c_c">
        <form onSubmit={handleSubmit} className="auth_form w100">
          <div className="flex_c_c"><h1>{texts.requestResetPassword[lang]}</h1> </div>
          <div className="flex_c_c box_input">
            <input onChange={handleChange} value={datas.email} placeholder="Email" className="input" type="email" name="email" id="email" onFocus={handleClearError}/>
            {error.email && <Exclamation/>}
          </div>
          <div className="label_error">{error.email}</div>
          <Link to="/login" className="a"><div className="link flex_e_c">{texts.rememberPassword[lang]}</div></Link>
          <div className="pg_10">
            <button disabled={loading} className="button primary_btn b_radius_3">{loading && <MinLoder/> || texts.request[lang]}</button>
          </div>
        </form>
      </div> 
    </section>
  );
}

export default RequestResetPassword;