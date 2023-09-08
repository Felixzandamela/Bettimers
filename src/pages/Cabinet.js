import React,{useState,useEffect} from "react";
import {Link,useNavigate} from "react-router-dom";
import {texts} from "./texts/Texts";
import {MinLoder,Loader,formatDate} from "./Utils";
import {useAuth,dbUsers,logOut} from './auth/FirebaseConfig';

const minutesMatch = ["02","04", "06","07","09","11", "13","14", "17", "21","24","25", "28", "30", "31","33", "34","36", "37", "39", "43", "46", "47","49", "50", "51","53","54", "56", "59"];
const colors = ["#7433c5","#670060"];
const bets = [2.10, 2.17, 2.64,2.71, 2.86, 3.12, 3.45, 3.67, 4.06, 4.71, 5.12, 5.87, 6.00, 6.34,6.56, 7.01, 7.33, 7.34,8.10,10.01];

// Função para embaralhar elementos de um array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const Cabinet = ({lang})=>{
  const [refresh,setRefresh]=useState(1);
  const [load,setLoad]=useState(false);
  const [datas,setDatas]=useState(null);
  const [user, setUser]=useState(null);
  const [open, setOpen] = useState(false);
  const currentUser = useAuth();
  const navigate = useNavigate();
  useEffect(()=>{
    if (currentUser) {
      dbUsers.child(currentUser.uid).on('value', (snapChat) =>{
        setUser(snapChat.val());
      });
    }
  },[currentUser]);
  
  useEffect(()=>{
    if(user){
      if(user.isBanned){
        alert(texts.isBanned[lang]);
        handleLogOut();
      }
      if(formatDate(user.subscription.expireAt).secondsLength >= 0){
        dbUsers.child(currentUser.uid).update({
          subscription:{status:false,expireAt:""}});
      }
      if(!user.subscription.status){
        navigate("/packages", {replace: true});
      }
    }
  },[user]);
  
  useEffect(()=>{
    setDatas(null);
    if(refresh){
      setLoad(true);
      var date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let nextHours = function(){
        let next_hours = [];  
        for(let h = 0; h <= 23; h++){
          if(hours <= h){
            next_hours.push(h < 10 ? "0" + h : "" + h);
          }
        }
        return next_hours
      } 
      const NEXTHOURS = nextHours();
      const getDatasToBet = function(){
        const datasBetPerHour = [];
        let currentHour = hours < 10 ? "0" + hours : ""+hours;
        for(let i in NEXTHOURS){
          for(let m = currentHour !== NEXTHOURS[i] ? 0 : minutes; m < 60; m++){
            let minuteBet  =  m < 10 ? "0"+m : ""+m;
            for(let j in minutesMatch){
              let seconds = Math.floor(Math.random()*30);
              let secondsBet =seconds < 10 ? "0"+seconds : seconds;
              if( minutesMatch[j] === minuteBet){
                const shuffleBets = shuffleArray(bets);
                const randomBet = shuffleBets[Math.floor(Math.random() * shuffleBets.length)];
                const datas = {
                  timeBet: NEXTHOURS[i]+":"+minuteBet+":"+ secondsBet,
                  colorBet: randomBet < 10 ? colors[0] : colors[1],
                  xBet: parseFloat(randomBet).toFixed(2)
                }
                datasBetPerHour.push(datas);
              }
            }
          }
        }
        return datasBetPerHour;
      }
      setTimeout(()=>{
        setDatas(getDatasToBet());
        setLoad(false);
      },1000);
    }
    return () =>{
      setDatas({});
    }
  },[refresh,lang]);
  async function handleLogOut(){
    try{
     await logOut();
     localStorage.setItem("isAuthenticated", "");
     navigate("/login", {replace:true});
    }catch(error){
      console.log(error)
    }
  }
  const handleClose =()=>{
    setOpen(!open);
  }
  
  if(!user){return <Loader/>}
  return(
    <section className="sec_1 pg_10 flex_c_c">
      <div className="w100">
        <div className="header pg_10 flex_c_c">
          <div className="card pg_10 b_radius_60 flex_c_c">
            <div className="">
              {datas && <div style={{color:datas[0].colorBet}}  className="currentBet"> {datas[0].xBet && "+"}{datas[0].xBet}<span className="x_prefix">
             {datas[0].xBet && "x" }</span></div>}
            </div>
          </div>
        </div>
        <div className="pg_10 card_datas">
          <div className="card_data pg_10 flex_c_c">
            <div className="warning_protetion pg_10 b_radius_8">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
              </svg> 
              <div>{datas && datas[0].timeBet || "--:--:--"}</div>
            </div>
            <div className="warning_protetion pg_10 b_radius_8">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-shield-check" viewBox="0 0 16 16">
                  <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
                  <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                <div style={{color:colors[0]}}>2.00<span>x</span></div>
              </div>
            </div>
            <div className="flex_c_c">
              <button disabled={load} onClick={()=>setRefresh(refresh+1)} className="button primary_btn b_radius_3">{load && <MinLoder/> || texts.nextBtn[lang]}</button>
            </div>
            <div className="flex_c_c">
              <button onClick={handleClose} className="button secondary_btn">
                {texts.seeAll[lang]}
              </button>
            </div>
            <AllBets lang={lang} datas={datas} open={open} onClose={(handleClose)}/>
          </div>
        </div>
      </section>
    );
  }
  
 const AllBets = ({lang, open, datas, onClose}) =>{
  const [listData,setListData]=useState([]);
  const [page,setPage]=useState(0);
  const [isLoading,setIsLoading]=useState(false);
  const [pageSize, setPageSize] = useState(52);
  useEffect(()=>{
    if(datas){
    setListData(datas.slice(0,pageSize));
    setPage(0);
    }
  },[datas, pageSize,open]);
  useEffect(()=>{
    if(listData.length < (page+ 1)* pageSize){
      setPage(Math.floor(listData.length / pageSize))
    }
  },[listData]);
  function handleScroll(event) {
    const element=event.target;
    if (element.scrollHeight - element.scrollTop=== element.clientHeight && !isLoading) {
      setIsLoading(true);
      const nextPage=page+1;
      const nextData=datas.slice(nextPage*pageSize,(nextPage+1)*pageSize);
      setTimeout(()=>{
        setListData([...listData,...nextData]);
        setPage(nextPage);
        setIsLoading(false);
      },1000); // simulating a delay for the datas to load
    }
  }
  const hasMoreData= datas && listData.length < datas.length;
  const handlePageSize =(event)=>{
    setPageSize(parseInt(event.target.value));
  }
  
  if(!open){return null}
  return(
    <div  className="modal_f flex_c_c">
      <div className="modal_box">
        <div className="modal_header flex_b_c">
          <h4>{texts.allNextBets[lang]}</h4>
          <div className="flex_b_c">
            <svg onClick={onClose} className="a_aside_close" fill="currentColor" opacity="1.0" baseProfile="full" width="24" height="24" viewBox="0 0 24.00 24.00"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
          </div>
        </div>
        <div onScroll={handleScroll} className="bets_box">
          <div className="flex_wrap w100">
            {listData && listData.map(d=>(
              <div key={d.timeBet} className="bets_wrap">
                <div style={{background:d.colorBet}} className="bet flex_c_c">              {d.timeBet}</div>
              </div>
            ))}
          </div>
          <div className="flex_c_c betsLoader">
            {isLoading && hasMoreData && <MinLoder/>}
          </div>
        </div>
      </div>
    </div>
  );
} 
  
export default Cabinet;