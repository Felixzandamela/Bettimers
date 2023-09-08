import React,{useState,useEffect} from "react";
import {useNavigate,Link} from "react-router-dom";
import {texts} from "../texts/Texts";
import {useAuth} from "./FirebaseConfig";
import {MinLoder,Toast,Exclamation,PasswordViewer,authErros} from "../Utils";

const ResetPassword =({lang})=>{
  const currentUser = useAuth();
  const navigate = useNavigate();
  const [loading,setLoading]= useState(false);
  const [viewPassword,setViewPassword] = useState(false);
  const [datas,setDatas]=useState({password:"", repeatPassword:""});
  const [error,setError] = useState({password:null,repeatPassword:null,error:null});
  
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
    if(!datas.password){
      setError(prevError=>({...prevError,password:texts.invalidPassword[lang]}));
      errors.push(1);
    }
    if(datas.repeatPassword !== datas.password){
      setError(prevError=>({...prevError,repeatPassword:texts.passwordDontMatch[lang]}));
      errors.push(1);
    }
    if(errors.length <= 0){
      setLoading(true);
      handleChangePassword();
    }
  } // verificação de formulário
  
  async function handleChangePassword(){
    try{
      await currentUser.updatePassword(datas.password);
      navigate(-1 ,{replace:true});
    }catch(error){
      for(let i = 0; i < authErros.length; i++){
        if(error.code === authErros[i].name){
          let errorMessage = texts[authErros[i].target][lang]; // exemplo:texts.invalidPassword.ptPT retona "Senha inválido!"
          setError(prevError=>({...prevError,error:errorMessage}));
        }
      }
    }finally{setLoading(false);}
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
          <div className="flex_c_c"><h1>{texts.resetPasswordTitle[lang]}</h1></div>
          <div className="flex_c_c box_input">
            <input onChange={handleChange} value={datas.password} name="password" placeholder={texts.passwordLabel[lang]} className="input" type={!viewPassword && "password" || "text"} onFocus={handleClearError}/>
            {error.password && <Exclamation/>}
          </div>
          <div className="label_error">{error.password}</div>
           <div className="flex_c_c box_input">
            <input onChange={handleChange} value={datas.repeatPassword} name="repeatPassword" placeholder={texts.repeatPasswordLabel[lang]} className="input" type={!viewPassword && "password" || "text"} onFocus={handleClearError}/>
            {error.repeatPassword && <Exclamation/>}
            <PasswordViewer toggle={viewPassword} onToggle={()=>setViewPassword(!viewPassword)}/>
          </div>
          <div className="label_error">{error.repeatPassword}</div>
          <div className="pg_10">
            <button disabled={loading} className="button primary_btn b_radius_3">{loading && <MinLoder/> || texts.save[lang]}</button>
          </div>
        </form>
      </div> 
    </section>
  );
}

export default ResetPassword;