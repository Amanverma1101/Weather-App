const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector(".GPS"),
enterBtn = inputPart.querySelector(".enterBtn"),
backBtn = wrapper.querySelector("header i");

const weatherPart = document.querySelector(".weather-part"),
temperature = weatherPart.querySelector(".numb"),
region = weatherPart.querySelector(".location span"),
weatherDesc = weatherPart.querySelector(".weather")
wImg = weatherPart.querySelector("img");

const bottomDetails = document.querySelector(".bottom-details"),
feelLike = bottomDetails.querySelector(".feels .numb");
humidityPercent = bottomDetails.querySelector(".humidity .numb");

setInterval(updateTime,1000);

function updateTime(){
    var today = new Date();
    var ctime = today.getHours() + ":" + today.getMinutes()+":" + today.getSeconds();
    var dispTime = document.querySelector(".time");
    dispTime.innerText = ctime;
}


enterBtn.addEventListener("click", (e)=>{
 if(inputField.value!='')
  {
      requestAPI(inputField.value);
  }else{
    alert("Input Field is enpty");
  }
});

inputField.addEventListener("keyup", (e) =>{
  if(e.key=="Enter" && inputField.value!='')
  {
      requestAPI(inputField.value);
  }
});

locationBtn.addEventListener("click", ()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess,onError);
    }else{
        alert("Your Browser does not support GPS");
    }
});

function onSuccess(location){
   const {latitude,longitude} = location.coords;
   let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=3faab32602e1e55f5af627d71a3c371d`;
   fetchData(api);
}
function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestAPI(city){
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3faab32602e1e55f5af627d71a3c371d`;
    fetchData(api);
}

function fetchData(api){
    infoTxt.innerText = "Fetching Weather Details...";
    infoTxt.classList.add("pending");
    
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));    

}


function weatherDetails(info){
    if(info.cod =="404"){
        infoTxt.classList.replace("pending","error");
        infoTxt.innerText = `${inputField.value} name does'nt exist.`;
    }else{
        infoTxt.classList.remove("pending","error");
        wrapper.classList.add("active");
        temperature.innerText = (info.main.temp-273).toFixed(1);
        region.innerText =  `${info.name}, ${info.sys.country}`;
        weatherDesc.innerText = info.weather[0].description;
        feelLike.innerText = (info.main.feels_like-273).toFixed(1);
        humidityPercent.innerText = (info.main.humidity).toFixed(0);
        const id = info.weather[0].id;
        if(id>=200 && id<=232){
            wImg.src = "Weather Icons/storm.svg";
        }
        else if(id>=300 && id<=321){
            wImg.src = "Weather Icons/rain.svg";
        }
        else if(id>=500 && id<=531){
            wImg.src = "Weather Icons/rain.svg";
        }
        else if(id>=600 && id<=622){
            wImg.src = "Weather Icons/snow.svg";
        }
        else if(id>=701 && id<=781){
            wImg.src = "Weather Icons/haze.svg";
        }
        else if(id==800){
            wImg.src = "Weather Icons/clear.svg";
        }
        else if(id>800){
            wImg.src = "Weather Icons/cloud.svg";
        }

        // console.log(id);
        // console.log(info);
    }
}

backBtn.addEventListener("click",()=>{
    wrapper.classList.remove("active");
});