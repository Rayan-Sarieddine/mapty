'use strict';
class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10); //each workout to have an id that we can retrieve it by
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    // this.type = 'cycling';
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  //private properties for the class
  #map;
  #mapevent;
  constructor() {
    this._getPosition(); //get users postion as soon as app class is executed
    //form event submit
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
  }
  _getPosition() {
    //geo location api
    if (navigator.geolocation) {
      //if navigator exists
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
        console.log('could not get th eposition');
      });
    }
  }
  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];
    const mapi = `https://www.google.com/maps/@${latitude},${longitude}`;
    console.log(mapi);
    //show leaflet
    this.#map = L.map('map').setView(coords, 13); //coords,zoom

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //event listener for when map is clicked given by leaflet
    this.#map.on(
      'click',
      //show form on left and focus on imput distance
      this._showForm.bind(this)
    );
  }
  _showForm(mape) {
    form.classList.remove('hidden');
    inputDistance.focus();
    this.#mapevent = mape;
  }
  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
  _newWorkout(e) {
    e.preventDefault();
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        '';
    //get the coord of the clicked point on the map
    const { lat, lng } = this.#mapevent.latlng;
    //put the pin on those coords
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        //pop stylings
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
          text: 'helo',
        })
      )
      .setPopupContent('hello')
      .openPopup();
  }
}
//create and call class(because in constructor we are calling the position, > the position will auto generate)
const app = new App();
