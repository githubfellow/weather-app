import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'
import Loader from './components/Loader'
import Weather from './components/Weather'
import Searcher from './components/Searcher'

function App() {
  // Estado para coordenadas que da el navegador
  const [coords, setCoords] = useState()

  // Estado para la info que traemos de la API
  const [weather, setWeather] = useState()

  // Estado para la info de una ciudad
  const [weatherCity, setWeatherCity] = useState()

  // Estado de las temperaturas del cliente
  const [temp, setTemp] = useState()

  // Estado de las temperaturas de ciudad
  const [tempCity, setTempCity] = useState()

  // Estado para cambio de imagenes de fondo
  const [iconID, setIconId] = useState("")

  // Estado para cambio del valor del input
  const [inputValue, setInputValue] = useState('');

  const bgImages = {
    "01d": "bg-[url('/images/bgImages/bg01n.jpg')]",
    "01n": "bg-[url('/images/bgImages/bg01n.jpg')]",
    "02d": "bg-[url('/images/bgImages/bg02d.jpg')]",
    "02n": "bg-[url('/images/bgImages/bg02n.jpg')]",
    "03d": "bg-[url('/images/bgImages/bg03d.jpg')]",
    "03n": "bg-[url('/images/bgImages/bg03n.jpg')]",
    "04d": "bg-[url('/images/bgImages/bg04d.jpg')]",
    "04n": "bg-[url('/images/bgImages/bg04n.jpg')]",
    "09d": "bg-[url('/images/bgImages/bg09d.jpg')]",
    "09n": "bg-[url('/images/bgImages/bg09n.jpg')]",
    "10d": "bg-[url('/images/bgImages/bg10d.jpg')]",
    "10n": "bg-[url('/images/bgImages/bg10n.jpg')]",
    "11d": "bg-[url('/images/bgImages/bg11d.jpg')]",
    "11n": "bg-[url('/images/bgImages/bg11n.jpg')]",
    "13d": "bg-[url('/images/bgImages/bg13d.jpg')]",
    "13n": "bg-[url('/images/bgImages/bg13n.jpg')]",
    "50d": "bg-[url('/images/bgImages/bg50d.jpg')]",
    "50n": "bg-[url('/images/bgImages/bg50n.jpg')]"
  }

  let error = false

  const success = (pos) => {
    const currentCoords = {
      lat: pos.coords.latitude,
      lon: pos.coords.longitude
    }
    setCoords(currentCoords)
  }

  console.log(weather)

  // Efecto para la localización
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success)
  }, [])

  // Efecto del llamado a la API - usuario
  useEffect(() => {
    if(coords) {
      const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=68187a38d653607d35b491707478c55a`

    axios.get(URL)
      .then((res) => {
        setWeather(res.data)
        const celsius = (res.data.main.temp - 273.15).toFixed(1)
        const fahrenheit= (celsius * (9/5) + 32).toFixed(1)
        const newTemps = {
          celsius,
          fahrenheit
        }
        console.log(res.data.weather[0].icon)
        setIconId(res.data.weather[0].icon)
        setTemp(newTemps)
      })
      .catch((err) => console.log(err))
    }
  }, [coords])

// Efecto del llamado a la API - input
  useEffect(() => {
    if(coords) {
      const URLCity = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=68187a38d653607d35b491707478c55a`

    axios.get(URLCity)
      .then((res) => {
        console.log(res.data)
        setWeatherCity(res.data)

        const celsius = (res.data.main.temp - 273.15).toFixed(1)
        const fahrenheit= (celsius * (9/5) + 32).toFixed(1)
        const newTemps = {
          celsius,
          fahrenheit
        }
        setTempCity(newTemps)
        setInputValue(inputValue)
        console.log(inputValue)
        
      })
      .catch((err) => {
        console.log(err)
        error = true
      })
    }
  }, [coords, inputValue])


  return (
    <div className={`App ${bgImages[iconID]} bg-cover min-h-screen grid place-content-center px-2`}>
      
      {
        weather ? (
          <div>
            <Weather weather={weather} temp={temp} />

            <form action="">
                <input type="text" onChange={e => setInputValue(e.target.value)} />
                <button className='text-white bg-black p-2' type='button' onClick={e => {
                  setInputValue(e.target.value)
                }}>Search</button>
            </form>

            {tempCity && <Searcher weather={weatherCity} temp={tempCity} />}
          </div>
          ) : (
            <Loader />
          )
      }
    </div>
  )
}

export default App
