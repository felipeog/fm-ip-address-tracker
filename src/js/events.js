window.addEventListener('load', () => {
  setLocation()
})

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const location = input.value
  setLocation(location)
})
