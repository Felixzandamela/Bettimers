import React,{useState, useEffect,useRef} from "react";
import {Link,useNavigate} from "react-router-dom";
import Cropper from 'cropperjs';
/*import "cropper.css";*/
import {texts} from "./texts/Texts";
import {useAuth,logOut,dbUsers} from './auth/FirebaseConfig';
import {Avatar, MinLoder,Copy,formatDate, Toast, Exclamation} from "./Utils";

const Profile = ({lang}) =>{
  const color = localStorage.getItem("avatarColor");
  const [user, setUser]=useState(null);
  const navigate = useNavigate();
  const currentUser = useAuth();
  const [error,setError]= useState(null);
  const [fileName,setFileName]=useState('');
  const [cropper,setCropper]=useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const fileInput=useRef(null);
  const image=useRef(null);
  
  useEffect(()=>{
    if(currentUser){
      dbUsers.child(currentUser.uid).on('value', (snapChat) =>{
        setUser(snapChat.val());
      });
    }
  },[currentUser]);
  
  async function handleLogOut(){
    try{
     await logOut();
     localStorage.setItem("isAuthenticated", "");
     navigate("/login", {replace:true});
    }catch(error){
      console.log(error)
    }
  }
  
  const handleFileChange=(event)=>{
    const file=event.target.files[0];
    const reader=new FileReader();
    if(!/^image\/(jpeg|png|gif|bmp)$/.test(file.type)) {
    setError(texts.imageNotsupported[lang]);
    return;
    }
    reader.onload=()=>{
      image.current.setAttribute('src',reader.result);
      setFileName(file.name.split('.')[0]);
    };
    reader.readAsDataURL(file);
 };
 
  useEffect(()=>{
    if (cropper) {cropper.destroy();}
    const newCropper=new Cropper(image.current,{
      zoomable:true,
      dragMode:'move',
      aspectRatio:1,
      autoCropArea:1,
      scalable:true,
      cropBoxResizable:false,
      movable:true,
      checkCrossOrigin:true,
    });
    setCropper(newCropper);
  },[fileName]);
  
  const handlePreviewClick=()=>{
    const imgSrc=cropper.getCroppedCanvas({}).toDataURL();
    setLoading(true);
    handleSaveAvatar(imgSrc);
    setFileName("");
  };
  
  const handleSaveAvatar = async (imgSrc)=>{
    try{
      await dbUsers.child(currentUser.uid).update({
       avatar: imgSrc});
    }catch(error){
      console.log(Error)
    }finally{
      setLoading(false)
    }
  }
  
  return (
    <section className="sec_1 pg_20">
      <Toast props={error} onClear={()=>setError(null)}/>
     <img src="./public/assets/aviator-brasil.jpg"  className="profile_header b_radius_30"/>
     
      <div className="flex_c_c">
        <div className="avatar_box flex_c_c b_radius_60 pg_10">
         <Avatar avatar={user} color={color}/>
         <label htmlFor="input_imge">
             <div className="label_input_file b_radius_60 flex_c_c">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-camera-fill" viewBox="0 0 16 16">
                 <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                 <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
               </svg>
             </div>
            <input id="input_imge" ref={fileInput}  onChange={handleFileChange} className="input_imge" type="file" accept="image*"/>
         </label>
        </div>
      </div>
      
      <div style={{display: fileName && "flex" || "none"}} className="modal_f flex_c_c">
        <div className="modal_box">
          <div className="modal_header flex_b_c">
            <h4>{texts.editImage[lang]}</h4>
            <svg onClick={()=>setFileName('')} className="a_aside_close"  fill="currentColor" opacity="1.0" baseProfile="full" width="24" height="24" viewBox="0 0 24.00 24.00"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
          </div>
          <div className="modal_body">
            <img ref={image} heigth="300px" width="100%" className="crop_image" />
            </div>
             <div className="flex_c_c w100">
              <button disabled={loading} onClick={handlePreviewClick} className="button primary_btn m_btns b_radius_8">
              {loading && <MinLoder/> || texts.save[lang]}
             </button>
            </div>
        </div>
      </div>
      
      <div className="flex_c_c">
         <h1 className="profilename ellipsis">
        {user && user.name}
        </h1>
        <svg onClick={()=>setOpen(true)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pen-fill" viewBox="0 0 16 16">
        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z"/>
        </svg>
      </div>
      
     {user && <EditNameModal open={open} name={user.name} onClose={()=>setOpen(false)} lang={lang}/>}
      
      <div className="prof_box pg_10 b_radius_8">
      <div className="flex_s_c prof_infos">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
          </svg>
        <div className="flex_b_c">
          <p>{user && user.email}</p>
        </div>
      </div>
      
      <div className="flex_s_c prof_infos">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-calendar2-date" viewBox="0 0 16 16">
           <path d="M6.445 12.688V7.354h-.633A12.6 12.6 0 0 0 4.5 8.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61h.675zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82h-.684zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23z"/>
           <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"/>
           <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z"/>
           </svg>
        <div className="flex_b_c">
          <p>{user && formatDate(user.createdAt, lang).fullDate}</p>
        </div>
      </div>
      <div className="flex_s_c prof_infos">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-geo-alt" viewBox="0 0 16 16">
           <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
           <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>
        <div className="flex_b_c">
          <p>{user && `${user.location[0]}, ${user.location[1]}`}</p>
        </div>
      </div>
      
      <div className="flex_s_c prof_infos">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-fingerprint" viewBox="0 0 16 16">
         <path d="M8.06 6.5a.5.5 0 0 1 .5.5v.776a11.5 11.5 0 0 1-.552 3.519l-1.331 4.14a.5.5 0 0 1-.952-.305l1.33-4.141a10.5 10.5 0 0 0 .504-3.213V7a.5.5 0 0 1 .5-.5Z"/>
        <path d="M6.06 7a2 2 0 1 1 4 0 .5.5 0 1 1-1 0 1 1 0 1 0-2 0v.332c0 .409-.022.816-.066 1.221A.5.5 0 0 1 6 8.447c.04-.37.06-.742.06-1.115V7Zm3.509 1a.5.5 0 0 1 .487.513 11.5 11.5 0 0 1-.587 3.339l-1.266 3.8a.5.5 0 0 1-.949-.317l1.267-3.8a10.5 10.5 0 0 0 .535-3.048A.5.5 0 0 1 9.569 8Zm-3.356 2.115a.5.5 0 0 1 .33.626L5.24 14.939a.5.5 0 1 1-.955-.296l1.303-4.199a.5.5 0 0 1 .625-.329Z"/>
        <path d="M4.759 5.833A3.501 3.501 0 0 1 11.559 7a.5.5 0 0 1-1 0 2.5 2.5 0 0 0-4.857-.833.5.5 0 1 1-.943-.334Zm.3 1.67a.5.5 0 0 1 .449.546 10.72 10.72 0 0 1-.4 2.031l-1.222 4.072a.5.5 0 1 1-.958-.287L4.15 9.793a9.72 9.72 0 0 0 .363-1.842.5.5 0 0 1 .546-.449Zm6 .647a.5.5 0 0 1 .5.5c0 1.28-.213 2.552-.632 3.762l-1.09 3.145a.5.5 0 0 1-.944-.327l1.089-3.145c.382-1.105.578-2.266.578-3.435a.5.5 0 0 1 .5-.5Z"/>
        <path d="M3.902 4.222a4.996 4.996 0 0 1 5.202-2.113.5.5 0 0 1-.208.979 3.996 3.996 0 0 0-4.163 1.69.5.5 0 0 1-.831-.556Zm6.72-.955a.5.5 0 0 1 .705-.052A4.99 4.99 0 0 1 13.059 7v1.5a.5.5 0 1 1-1 0V7a3.99 3.99 0 0 0-1.386-3.028.5.5 0 0 1-.051-.705ZM3.68 5.842a.5.5 0 0 1 .422.568c-.029.192-.044.39-.044.59 0 .71-.1 1.417-.298 2.1l-1.14 3.923a.5.5 0 1 1-.96-.279L2.8 8.821A6.531 6.531 0 0 0 3.058 7c0-.25.019-.496.054-.736a.5.5 0 0 1 .568-.422Zm8.882 3.66a.5.5 0 0 1 .456.54c-.084 1-.298 1.986-.64 2.934l-.744 2.068a.5.5 0 0 1-.941-.338l.745-2.07a10.51 10.51 0 0 0 .584-2.678.5.5 0 0 1 .54-.456Z"/>
        <path d="M4.81 1.37A6.5 6.5 0 0 1 14.56 7a.5.5 0 1 1-1 0 5.5 5.5 0 0 0-8.25-4.765.5.5 0 0 1-.5-.865Zm-.89 1.257a.5.5 0 0 1 .04.706A5.478 5.478 0 0 0 2.56 7a.5.5 0 0 1-1 0c0-1.664.626-3.184 1.655-4.333a.5.5 0 0 1 .706-.04ZM1.915 8.02a.5.5 0 0 1 .346.616l-.779 2.767a.5.5 0 1 1-.962-.27l.778-2.767a.5.5 0 0 1 .617-.346Zm12.15.481a.5.5 0 0 1 .49.51c-.03 1.499-.161 3.025-.727 4.533l-.07.187a.5.5 0 0 1-.936-.351l.07-.187c.506-1.35.634-2.74.663-4.202a.5.5 0 0 1 .51-.49Z"/>
        </svg>
       
        {currentUser && <div className="flex_b_c w100">
          <p>{currentUser.uid}</p>
          <Copy lang={lang} value={currentUser.uid}/>
        </div>
        }
      </div>
    </div> 
   <div className="prof_box pg_10 b_radius_8">
      <div className="flex_s prof_infos">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-gem" viewBox="0 0 16 16">
        <path d="M3.1.7a.5.5 0 0 1 .4-.2h9a.5.5 0 0 1 .4.2l2.976 3.974c.149.185.156.45.01.644L8.4 15.3a.5.5 0 0 1-.8 0L.1 5.3a.5.5 0 0 1 0-.6l3-4zm11.386 3.785-1.806-2.41-.776 2.413 2.582-.003zm-3.633.004.961-2.989H4.186l.963 2.995 5.704-.006zM5.47 5.495 8 13.366l2.532-7.876-5.062.005zm-1.371-.999-.78-2.422-1.818 2.425 2.598-.003zM1.499 5.5l5.113 6.817-2.192-6.82L1.5 5.5zm7.889 6.817 5.123-6.83-2.928.002-2.195 6.828z"/></svg>
        <div className="flex_b_c">
          {user && user.subscription.status && <p>{texts.subscribed[lang]}</p>
          ||
           <p>{texts.noSubscription[lang]}, <Link to="/packages" className="a"> <span className="a_links">{texts.subscribe[lang]}</span></Link></p>
          }
        </div>
      </div>
      <div className="flex_s_c prof_infos">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-calendar2-date" viewBox="0 0 16 16">
           <path d="M6.445 12.688V7.354h-.633A12.6 12.6 0 0 0 4.5 8.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61h.675zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82h-.684zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23z"/>
           <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"/>
           <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z"/>
           </svg>
        <div className="flex_b_c">
          {user && user.subscription.expireAt &&<p> {`${texts.expireAt[lang]} ${formatDate(user.subscription.expireAt, lang).fullDate}`}
          </p>}
        </div>
      </div>
    </div>
  
  
    <div className="prof_box pg_10 b_radius_8">
    <Link to="/reset-password" className="a">
      <div className="flex_s prof_infos">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
          <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
        </svg>
        <div className="flex_b_c">
          <p>{texts.changePassword[lang]}</p>
        </div>
      </div>
      </Link>
      <div onClick={handleLogOut} className="flex_s_c prof_infos">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
        <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
        </svg>
        <div className="flex_b_c">
          <p>{texts.logout[lang]}</p>
        </div>
      </div>
    </div>
  </section> 
  );
}

const EditNameModal = ({lang, open, name, onClose}) =>{
  const [loading,setLoading]= useState(false);
  const [datas,setDatas]=useState({name:name});
  const [error,setError]=useState({name:null});
  const currentUser = useAuth();
  const handleChange =(event)=>{
    const field = event.target.name;
    const value = event.target.value;
    setDatas(prevData=>({...prevData,[field]:value}));
  } // em cada input em digitação atualiza o valor no state
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = new Array();
    if(!datas.name || datas.name.length <= 2 ){
      setError(prevError=>({...prevError,name:texts.invalidFullName[lang]}))
      errors.push(1);
    }
    if(errors.length <= 0){
      setLoading(true);
      handleSaveName()
    }
  } // verificação de formulário
  
  const handleSaveName = async ()=>{
    try{
      await dbUsers.child(currentUser.uid).update({
        name: datas.name 
      });
    }catch(error){
      console.log(error);
    }finally{
      setLoading(false);
      onClose();
    }
  }
  
  const handleClearError = (event)=>{
    const field = event.target.name;
    setError(prevError=>({...prevError,[field]: null}));
  } // limpar os erros renderizados pelos inputs vazios ou inválidos
  
  if(!open){return null}
  return(
      <div  className="modal_f flex_c_c">
        <div className="modal_box">
          <div className="modal_header flex_b_c">
            <h4>{texts.editName[lang]}</h4>
            <svg onClick={onClose} className="a_aside_close"  fill="currentColor" opacity="1.0" baseProfile="full" width="24" height="24" viewBox="0 0 24.00 24.00"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
          </div>
          <div className="flex_c_c">
            <form onSubmit={handleSubmit} className="auth_form w100">
            <div className="flex_c_c box_input">
            <input onChange={handleChange} value={datas.name} placeholder={texts.fullName[lang]} className="input" type="text" name="name" id="name" onFocus={handleClearError}/>
            {error.name && <Exclamation/>}
          </div>
          <div className="label_error">{error.name}</div>
           
            <div className="pg_10">
            <button disabled={loading} className="button primary_btn b_radius_3">{loading && <MinLoder/> || texts.save[lang]}</button>
          </div>
            </form>
            </div>
        </div>
      </div>
    
  );
}

export default Profile;