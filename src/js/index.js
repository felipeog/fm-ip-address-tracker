/**
 * map config
 */
const map = L.map('map', {
  zoomControl: false,
})
const icon = L.icon({
  iconUrl: '../img/icon-location.svg',
  iconSize: [32, 42],
  iconAnchor: [32, 42],
})
const marker = L.marker([0, 0], { icon }).addTo(map)
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

/**
 * consts
 */
const form = document.querySelector('.search__form')
const input = document.querySelector('.search__input')

const tagIp = document.querySelector('.content__ip-address')
const tagLocation = document.querySelector('.content__location')
const tagTimezone = document.querySelector('.content__timezone')
const tagIsp = document.querySelector('.content__isp')

/**
 * functions
 */
const setContent = ({ ip, country, region, postalCode, timezone, isp }) => {
  tagIp.textContent = ip
  tagLocation.textContent = `${country}, ${region} ${postalCode}`
  tagTimezone.textContent = `UTC${timezone}`
  tagIsp.textContent = isp
}

const getQueryString = input => {
  if (!input || typeof input !== 'string') return ''

  const cleanInput = input
    .trim()
    .replace(/http:\/\//g, '')
    .replace(/https:\/\//g, '')
    .replace(/\//g, '')

  if (/\S+@\S+\.\S+/.test(cleanInput)) {
    return `&email=${cleanInput}`
  }

  if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(cleanInput)) {
    return `&ipAddress=${cleanInput}`
  }

  return `&domain=${cleanInput}`
}

const setLocation = (location = null) => {
  const queryString = getQueryString(location)

  fetch(`https://geo.ipify.org/api/v1?apiKey={{IPIFY_TOKEN}}${queryString}`)
    .then(res => res.json())
    .then(data => {
      if (data?.code) {
        const { code, messages } = data

        console.error(`Error @ setLocation >>>>> ${code}: ${messages}`)
        alert(
          `Please, check your input or try again later.\nError ${code}: ${messages}`,
        )
      } else {
        const {
          ip,
          location: { country, region, lat, lng, postalCode, timezone },
          isp,
        } = data

        map.setView([lat, lng], 13)
        marker.setLatLng(new L.LatLng(lat, lng))
        setContent({
          ip,
          country,
          region,
          postalCode,
          timezone,
          isp,
        })
      }
    })
    .catch(err => {
      console.error(`Error @ setLocation >>>>> ${err}`)
      alert('An error ocurred. Please, reload the page or try again later.')
    })
}

/**
 * events
 */
window.addEventListener('load', () => {
  setLocation()
})

form.addEventListener('submit', e => {
  e.preventDefault()

  const location = input.value
  setLocation(location)
})
