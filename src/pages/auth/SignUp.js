import React,{useState,useEffect} from "react";
import {useNavigate,Link} from "react-router-dom";
import {texts} from "../texts/Texts";
import {signUp,dbUsers} from "./FirebaseConfig";
import {MinLoder,Toast,Exclamation,PasswordViewer,authErros,getCurrentTime} from "../Utils";

const SignUp =({lang})=>{
  const navigate = useNavigate();
  const [loading,setLoading]= useState(false);
  const [viewPassword,setViewPassword] = useState(false);
  const [datas,setDatas]=useState({name:"",email:"",password:"", location:""});
  const [error,setError]=useState({name:null,email:null,password:null,error:null});
  
  const handleChange =(event)=>{
    const field = event.target.name;
    const value = event.target.value;
    setDatas(prevData=>({...prevData,[field]:value}));
  } // em cada input em digitação atualiza o valor no state
  
  useEffect(()=>{
  },[lang]);
  
  useEffect(()=>{
    async function getClientLocation(){
      let url = "https://ipinfo.io/json?token=b133d2b54b26e4";
      try{
        let res = await fetch(url);
        const data = await res.json();
        setDatas(prevData=>({...prevData, location:[data.city, data.country]}))
      }catch(error){
        console.log(error)
      }
    }
    getClientLocation();
  },[]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = new Array();
    if(!datas.name || datas.name.length <= 2 ){
      setError(prevError=>({...prevError,name:texts.invalidFullName[lang]}))
      errors.push();
    }
    if(!datas.email.match(/^[a-zA-Z][a-zA-Z0-9\-\_\.]+@[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}$/)){
      setError(prevError=>({...prevError,email:texts.invalidEmail[lang]}));
      errors.push(1);
    }
    if(!datas.password){
      setError(prevError=>({...prevError,password:texts.invalidPassword[lang]}));
      errors.push(1);
    }
    if(errors.length <= 0){
      setLoading(true);
      handleSignUp();
    }
  } // verificação de formulário
  
  async function handleSignUp(){
    try{
      let res = await signUp(datas.email,datas.password);
      let data = await res;
      if(res){
        createUser(res.user.uid);
      }
    }catch(error){
      for(let i = 0; i < authErros.length; i++){
        if(error.code === authErros[i].name){
          let errorMessage = texts[authErros[i].target][lang]; // exemplo: texts.invalidPassword.ptPT retona "Senha inválido!"
          setError(prevError=>({...prevError,error:errorMessage}));
        }
      }
      setLoading(false);
    }
  }
  async function createUser(uid){
    const data = {
      name: datas.name,
      email: datas.email,
      avatar: "",
      isAdmin: false,
      isBanned:false,
      location: datas.location,
      createdAt: getCurrentTime().fullDate,
      subscription:{
        status:false,
        expireAt: ""
      }
    } 
    try{
      const creartNewUser = await dbUsers.child(uid).set(data);
       navigate("/cabinet",{replace: true});
    }catch(error){
      console.log(error);
      setError(prevError=>({...prevError,error:error.message}));
    }finally{
      setLoading(false);
    }
  }
  const handleClearError = (event)=>{
    const field = event.target.name;
    setError(prevError=>({...prevError,[field]: null}));
  } // limpar os erros renderizados pelos inputs vazios ou inválidos
  
  return(
    <section className="sec_1 flex_c_c pg_10">
      <Toast props={error.error} onClear={()=>setError(prevError=>({...prevError,error:null}))}/>
      <div className="w100 flex_c_c">
        <form onSubmit={handleSubmit} className="auth_form w100">
          <div className="flex_c_c">
            <h1>{texts.signUp[lang]}</h1>
          </div>
          <div className="flex_c_c box_input">
            <input onChange={handleChange} value={datas.name} placeholder={texts.fullName[lang]} className="input" type="text" name="name" id="name" onFocus={handleClearError}/>
            {error.name && <Exclamation/>}
          </div>
          <div className="label_error">{error.name}</div>
          <div className="flex_c_c box_input">
            <input onChange={handleChange} value={datas.email} placeholder="Email" className="input" type="email" name="email" id="email" onFocus={handleClearError}/>
            {error.email && <Exclamation/>}
          </div>
          <div className="label_error">{error.email}</div>
          <div className="flex_c_c box_input">
            <input onChange={handleChange} value={datas.password} name="password" placeholder={texts.passwordLabel[lang]} className="input" type={!viewPassword && "password" || "text"} onFocus={handleClearError}/>
            {error.password && <Exclamation/>}
            <PasswordViewer toggle={viewPassword} onToggle={()=>setViewPassword(!viewPassword)}/>
          </div>
          <div className="label_error">{error.password}</div>
          <div className="pg_10">
            <button disabled={loading} className="button primary_btn b_radius_3">{loading && <MinLoder/> || texts.signUp[lang]}</button>
          </div>
          <Link to="/login" className="a"><div className="bottom_link flex_c_c"> {texts.iHaveAccount[lang]} </div> </Link>
        </form>
      </div>  
    </section>
  );
}

export default SignUp;