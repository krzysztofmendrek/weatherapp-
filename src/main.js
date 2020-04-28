import {getWeatherByCity} from './apiService.js';
import {mapListToDOMElements} from './DOMActions.js';

class WeatherApp {
  constructor() {
    this.viewElems = {}; 
    this.initializeApp(); 
  }

  initializeApp = () => {
    this.connectDOMElements();
    this.setupListeners();
  }

  connectDOMElements = () => {
    const listOfIds = Array.from(document.querySelectorAll('[id]')).map(elem => elem.id);
    this.viewElems = mapListToDOMElements(listOfIds);
  }

  setupListeners = () => {
    this.viewElems.searchInput.addEventListener('keydown', this.handleSubmit); 
    this.viewElems.searchButton.addEventListener('click', this.handleSubmit);
    this.viewElems.returnToSearchBtn.addEventListener('click', this.returnToSearch);
  }

  handleSubmit = () => {
    if(event.type === 'click' || event.key === 'Enter') {
      this.fadeInOut(); 
      let query = this.viewElems.searchInput.value;
      getWeatherByCity(query).then(data => {
        this.displayWeatherData(data);
        this.viewElems.searchInput.style.borderColor = 'initial';
        this.viewElems.searchInput.value = '';
        
      }).catch(() => {
        this.fadeInOut();
        this.viewElems.searchInput.style.borderColor = 'red';
        this.infoAboutError();
      })
    }
  }

  infoAboutError = () => {
    let infoError = document.createElement ('div');
    infoError.innerText = 'Incorrectly name of the city!';
    infoError.classList.add('info-error');
    this.viewElems.weatherSearchView.appendChild (infoError);
  }

  fadeInOut = () => {
    if(this.viewElems.mainContainer.style.opacity === '1' || this.viewElems.mainContainer.style.opacity === '') {
      this.viewElems.mainContainer.style.opacity = '0';
    } else {
      this.viewElems.mainContainer.style.opacity = '1';
    }
  }
  
  switchView = () => {
    if(this.viewElems.weatherSearchView.style.display !== 'none'){
      this.viewElems.weatherSearchView.style.display = 'none';
      this.viewElems.weatherForecastView.style.display = 'block'; 
    } else {
      this.viewElems.weatherSearchView.style.display = 'flex';
      this.viewElems.weatherForecastView.style.display = 'none';
    }
  } 
  
  displayWeatherData = data => {
    this.switchView();
    this.fadeInOut();
  
    const weather = data.consolidated_weather[0];
    this.viewElems.weatherCity.innerText = data.title;
  
    let icon = weather.weather_state_abbr;
    this.viewElems.weatherIcon.src = `https://www.metaweather.com/static/img/weather/${icon}.svg`;
    this.viewElems.weatherIcon.alt = weather.weather_state_name;
  
    const currentTemp = weather.the_temp.toFixed(1);
    const maxTemp = weather.max_temp.toFixed(1);
    const minTemp = weather.min_temp.toFixed(1);
  
    this.viewElems.weatherCurrentTemp.innerText = `Current temperature: ${currentTemp}°C`;
    this.viewElems.weatherMaxTemp.innerText = `Max. temperature: ${maxTemp}°C`;
    this.viewElems.weatherMinTemp.innerText = `Min. temperature: ${minTemp}°C`;
  }
  
  returnToSearch = () => {
    this.fadeInOut();
  
    setTimeout(() => {
      this.switchView();
      this.fadeInOut();
    }, 500);
  }
}

document.addEventListener('DOMContentLoaded', new WeatherApp());
