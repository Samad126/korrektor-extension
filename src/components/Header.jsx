import korrektorLogo from '../assets/korrektorLogo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faX } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const mobileMenu = useRef();
  const mobileDiv = useRef();

  function handleMenu() { 
    mobileMenu.current.classList.toggle('opened');
    mobileDiv.current.classList.toggle('visibleList');
    document.body.classList.toggle('overflow-hidden');
  }

  return (
    <>
      <header className="header flex items-center justify-between">
        <NavLink end><img className="logo-img" src={korrektorLogo} alt="" /></NavLink>
        <button onClick={handleMenu} id='hamburgerToggler'>{<FontAwesomeIcon icon={faBars}></FontAwesomeIcon>}</button>
        <ul id='desktopList' className='desktop-list'>
          <li><NavLink to={'/about'}>Haqqımızda</NavLink></li>
        </ul>
        <div ref={mobileDiv} id='mobileList' className='mobile-list'>
          <div onClick={handleMenu} id='backdrop'></div>
          <div ref={mobileMenu} id='menuContainer' className='menu-container closed'>
            <button onClick={handleMenu} className='self-start'><FontAwesomeIcon icon={faX} /></button>
            <ul id='menu'>
              <li><NavLink onClick={handleMenu} to={'/about'}>Haqqımızda</NavLink></li>
            </ul>
          </div>
        </div>
      </header>
      <ToastContainer />
    </>
  );
};

export default Header;

export const showToast = () => {
  toast.error('Mətndəki hərf (boşluq və simvol daxil) sayı 255-dən artıq olmamalıdır!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
};
