// returns the correct query string; email, ip address or domain
const getQueryString = (input) => {
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

// set the content in the html elements
const setContent = ({ ip, country, region, postalCode, timezone, isp }) => {
  tagIp.textContent = ip
  tagLocation.textContent = `${country}, ${region} ${postalCode}`
  tagTimezone.textContent = `UTC${timezone}`
  tagIsp.textContent = isp
}

// set the map view and set the marker's position
const setLocation = (location = null) => {
  const queryString = getQueryString(location)

  fetch(`https://geo.ipify.org/api/v1?apiKey={{IPIFY_TOKEN}}${queryString}`)
    .then((res) => res.json())
    .then((data) => {
      if (data?.code) {
        const { code, messages } = data

        console.error(`Error @ setLocation >>>>> ${code}: ${messages}`)
        alert(
          `Please, check your input or try again later.\nError ${code}: ${messages}`
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
    .catch((err) => {
      console.error(`Error @ setLocation >>>>> ${err}`)
      alert('An error ocurred. Please, reload the page or try again later.')
    })
}
