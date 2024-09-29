// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// import { store } from './redux/store.js'
// import { Provider } from 'react-redux'
import './index.css'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

const RECAPTCHA_PUBLIC_KEY = '6LclazUqAAAAAONP597DHh_OK8g-ZgWC3COFjiYL';
// const RECAPTCHA_PUBLIC_KEY = '6LeuXjUqAAAAAEFW3-EoJE5DX3k-38NeBKC1umlq';

createRoot(document.getElementById('root')).render(
    // <Provider store={store}>
    // </Provider>
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_PUBLIC_KEY}><App /></GoogleReCaptchaProvider>

)
