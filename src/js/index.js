// console.log('{{IPIFY_TOKEN}}')
// console.log('{{MAPBOX_TOKEN}}')

const map = L.map('mapid')
const marker = L.marker([0, 0]).addTo(map)
const layer = L.tileLayer(
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: '{{MAPBOX_TOKEN}}',
  },
).addTo(map)

window.addEventListener('load', () => {
  fetch('https://geo.ipify.org/api/v1?apiKey={{IPIFY_TOKEN}}')
    .then(res => res.json())
    .then(({ location: { lat, lng } }) => {
      map.setView([lat, lng], 13)
      marker.setLatLng(new L.LatLng(lat, lng))
    })
    .catch(err => console.error(err))
})
