// create map
const map = L.map('map', {
  zoomControl: false,
})
const icon = L.icon({
  iconUrl: '../img/icon-location.svg',
  iconSize: [32, 42],
  iconAnchor: [32, 42],
})
const marker = L.marker([0, 0], { icon }).addTo(map)
L.tileLayer(
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: '{{MAPBOX_TOKEN}}',
  }
).addTo(map)

// form elements
const form = document.querySelector('.search__form')
const input = document.querySelector('.search__input')

// content elements
const tagIp = document.querySelector('.content__ip-address')
const tagLocation = document.querySelector('.content__location')
const tagTimezone = document.querySelector('.content__timezone')
const tagIsp = document.querySelector('.content__isp')
