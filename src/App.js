import React, { Component } from 'react'
import './App.css'

const API_KEY = 'dbd2c2e20847ddf69e039aa6027a70b5'

const SUPPORTED_LANGUAGES = [
    "AF", "AL", "AR", "HY", "AZ",
    "EU", "BY", "BU", "LI", "MY",
    "CA", "CN", "TW", "CR", "CZ",
    "DK", "DV", "NL", "EN", "EO",
    "ET", "FA", "FI", "FR", "FC",
    "GZ", "DL", "KA", "GR", "GU",
    "HT", "IL", "HI", "HU", "IS",
    "IO", "ID", "IR", "IT", "JP",
    "JW", "KM", "KR", "KU", "LA",
    "LV", "LT", "ND", "MK", "MT",
    "GM", "MI", "MR", "MN", "NO",
    "OC", "PS", "GN", "PL", "BR",
    "PA", "RO", "RU", "SR", "SK",
    "SL", "SP", "SI", "SW", "CH",
    "TL", "TT", "TH", "TR", "TK",
    "UA", "UZ", "VU", "CY", "SN",
    "JI", "YI",
]

class App extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            raining: false
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                this.setState({ coordinates: pos.coords })
                this.check()
            }, () => {
                this.check()
            }, options)
        }

        this.check()

        setInterval(() => this.check(), 10 * 60 * 1000)
    }

    check() {
        fetch('https://ipinfo.io/json')
            .then(res => res.json())
            .then(ip => {
                let lang = ip.country
                if (!SUPPORTED_LANGUAGES.includes(lang)) {
                    lang = "SE"
                }

                let crd = this.state.coordinates
                crd = crd || {
                    latitude: +ip.loc.split(',')[0],
                    longitude: +ip.loc.split(',')[1],
                }

                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&APPID=${API_KEY}`
                return fetch(url)
            })
            .then(c => c.json())
            .then(forecast => {
                const id = forecast.weather[0].id

                // As defined in https://openweathermap.org/weather-conditions
                const raining = id >= 200 && id <= 599
                
                this.setState({ raining: raining, loading: false })
            })
    }

    render() {

        const { loading, raining } = this.state

        if (loading) {
            return null
        }

        return (
            <div className="app">
                <h1 className="hero">{ raining ? 'Ja' : 'Nej' }</h1>
            </div>
        )
    }
}

export default App
