import React,{useState,useEffect} from "react";
import "./style.css";
//import "./admin.css";
import {useAuth,dbUsers} from './pages/auth/FirebaseConfig';
import {BrowserRouter,Routes,Route,useNavigate, useLocation,Outlet,Redirect, Link} from "react-router-dom";
import {getLang, Avatar} from "./pages/Utils";
import  LanguageModal from "./pages/modals/LanguageModal";
import Onboarding from "./pages/Onboarding";
import Cabinet from "./pages/Cabinet";
import Profile from "./pages/Profile";
import Packages from "./pages/Packages";
import Login from "./pages/auth/Login";
import RequestResetPassword from "./pages/auth/RequestResetPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import SignUp from "./pages/auth/SignUp";
import CheckAuth from "./pages/auth/CheckAuth";

const App = ()=>{
  const [lang, setLang] = useState(getLang());
  return(
    <main>
      <BrowserRouter>
        <Routes>
          <Route  path="/" element={<Layout onChangeLanguage={(lang)=>setLang(lang)}/>}>
            <Route index element={<Onboarding lang={lang}/>}/>
            <Route path="login" element={<Login lang={lang}/>}/>
            <Route path="request-reset-password" element={<RequestResetPassword lang={lang}/>}/>
            <Route path="reset-password" element={<ResetPassword lang={lang}/>}/>
            <Route path="sign-up" element={<SignUp lang={lang}/>}/>
            <Route path="cabinet" element={<CheckAuth><Cabinet lang={lang}/></CheckAuth>}/>
            <Route path="profile" element={<CheckAuth><Profile lang={lang}/></CheckAuth>}/>
            <Route path="/packages" element={<CheckAuth><Packages lang={lang}/></CheckAuth>}/>
            
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  );
}

const Layout = ({onChangeLanguage}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useAuth();
  const [avatar, setAvatar]=useState(null);
  const [open, setOpen] = useState({langModal: false});
  const [show, setShow] = useState({
    back: null, avatar:null
  })
  
  const color = localStorage.getItem("avatarColor");
  useEffect(()=>{
    if(currentUser){
      dbUsers.child(currentUser.uid).on('value', (snapChat) =>{
        setAvatar(snapChat.val());
      });
    }
  },[currentUser]);
  
  useEffect(()=>{
    const isBack = (/^(\/|\/cabinet)$/i.test(location.pathname));
    const isCabinet = (/^(\/cabinet|\/profile|\/packages)$/i.test(location.pathname));
    setShow(prevShow=>({...prevShow, back: isBack, avatar: isCabinet}));
  },[location.pathname]);
  
  const handleCloseLangModal = () =>{
    setTimeout(()=>{
      setOpen(prevOpen=>({...prevOpen,langModal:!prevOpen.langModal}));
    },400);
  }
  
  return(
    <section>
      <nav className="nav pg_10 w100 flex_b_c">
        <div className="flex_b_c">
        {!show.back && <div onClick={()=>navigate(-1)} className="navBtnBox b_radius_60 flex_c_c">
          <svg fill="currentColor" opacity="1.0" baseProfile="full" width="26" height="26" viewBox="0 0 24.00 24.00"><path d="M20 11v2H7.99l5.505 5.505-1.414 1.414L4.16 12l7.92-7.92 1.414 1.415L7.99 11H20z"/></svg>
        </div>
        }
        <div className="logo">
        Bettimers
        </div>
        </div>
        <div className="flex_b_c">
          {show.avatar &&  avatar && <Link to="/profile" className="a">
            <div className="navBtnBox flex_c_c b_radius_60">
              <Avatar avatar={avatar} color={color}/>
            </div>
          </Link>
          }
          <div onMouseOut={handleCloseLangModal} onClick={handleCloseLangModal} className="navBtnBox flex_c_c b_radius_60">
            <div className="nav-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-translate" viewBox="0 0 16 16">
                <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286H4.545zm1.634-.736L5.5 3.956h-.049l-.679 2.022H6.18z"/>
                <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2zm7.138 9.995c.193.301.402.583.63.846-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6.066 6.066 0 0 1-.415-.492 1.988 1.988 0 0 1-.94.31z"/>
              </svg>
            </div>
            <LanguageModal open={open.langModal} onChangeLang={(lang)=>onChangeLanguage(lang)}/>
          </div>
        </div>
      </nav>
      <Outlet/>
    </section>
  )
}

export default App;