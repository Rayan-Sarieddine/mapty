'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
let map, mapevent;
class App {
  constructor() {
    this._getPosition(); //get users postion as soon as app class is executed
  }
  _getPosition() {
    //geo location api
    if (navigator.geolocation) {
      //if navigator exists
      navigator.geolocation.getCurrentPosition(this._loadMap, () => {
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
    map = L.map('map').setView(coords, 13); //coords,zoom

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    //event listener for when map is clicked given by leaflet
    map.on('click', mape => {
      //show form on left and focus on imput distance
      form.classList.remove('hidden');
      inputDistance.focus();
      mapevent = mape;
    });
  }
  _showForm() {}
  _toggleElevationField() {}
  _newWorkout() {}
}
//create and call class(because in constructor we are calling the position, > the position will auto generate)
const app = new App();

//form event submit
form.addEventListener('submit', e => {
  e.preventDefault();
  inputCadence.value =
    inputDistance.value =
    inputDuration.value =
    inputElevation.value =
      '';
  //get the coord of the clicked point on the map
  const { lat, lng } = mapevent.latlng;
  //put the pin on those coords
  L.marker([lat, lng])
    .addTo(map)
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
});
inputType.addEventListener('change', () => {
  //making sure one of them is hidden when the other is visible
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});
