/**
 * map config
 */
const map = L.map('map')
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

/**
 * consts
 */
const form = document.querySelector('.search__form')
const input = document.querySelector('.search__input')

const tagIp = document.querySelector('.content__ip')
const tagCountry = document.querySelector('.content__country')
const tagRegion = document.querySelector('.content__region')
const tagPostalCode = document.querySelector('.content__postal-code')
const tagTimezone = document.querySelector('.content__time-zone')
const tagIsp = document.querySelector('.content__isp')

/**
 * functions
 */
const setContent = ({ ip, country, region, postalCode, timezone, isp }) => {
  tagIp.textContent = ip
  tagCountry.textContent = country
  tagRegion.textContent = region
  tagPostalCode.textContent = postalCode
  tagTimezone.textContent = timezone
  tagIsp.textContent = isp
}

const setLocation = (location = null) => {
  const queryString = location ? `&ipAddress=${location}` : ''

  fetch(`https://geo.ipify.org/api/v1?apiKey={{IPIFY_TOKEN}}${queryString}`)
    .then(res => res.json())
    .then(data => {
      if (data?.messages) {
        alert(data.messages)
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
      console.error(err)
      alert('An error ocurred.')
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
