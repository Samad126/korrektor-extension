import './App.css';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import Root from './pages/Root';
import ErrorPage from './pages/ErrorPage';
import About from './pages/About';
import Main from './components/Main';
import { Provider } from 'react-redux';
import { store } from './redux/store';

const RECAPTCHA_PUBLIC_KEY = '6LclazUqAAAAAONP597DHh_OK8g-ZgWC3COFjiYL';

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Main />,
        },
        {
          path: 'about',
          element: <About />,
        },
      ],
    },
  ]);

  return (
    <Provider store={store}>
      <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_PUBLIC_KEY}>
        <RouterProvider router={router} />
      </GoogleReCaptchaProvider>
    </Provider>
  );
};

export default App;
