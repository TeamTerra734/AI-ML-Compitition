import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

import logo from "/icon.png";
import Cookies from "js-cookie"
function MyNav() {
  const location = useLocation();
  const navigate = useNavigate(); // Use useNavigate for programmatic navigation

  const [activeKey, setActiveKey] = useState(location.pathname);
  const [hasScrolledPast100, setHasScrolledPast100] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolledPast100(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [myStyle, setMyStyle] = useState({
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Initial style with shadow
  });

  // Update style based on scroll position
  useEffect(() => {
    setMyStyle({
      boxShadow: hasScrolledPast100 ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
    });
  }, [hasScrolledPast100]);

  const handleLinkClick = (path) => (event) => {
    event.preventDefault(); // Prevent default anchor tag behavior (full page reload)
    navigate(path); // Programmatically change route using useNavigate
    setActiveKey(path); // Update active link state
  };
  const logOutFunc = ()=>{
    Cookies.remove("userId");
    Cookies.remove("IdToken");
    window.location.assign("/");
  }
  return (
    <Navbar className='fixed-top' expand="lg" bg="dark" variant="dark" style={myStyle}>
      <Container>
        <Navbar.Brand href="/" onClick={handleLinkClick('/')}>
          <img src={logo} style={{ height: "40px", margin: "0 10px 0 0" }} />
          Satelizer
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              href="#" // Avoid unnecessary links, handle click programmatically
              onClick={handleLinkClick('/user/adddata')}
              active={activeKey === '/user/adddata'}
            >
              Add Data
            </Nav.Link>
            <Nav.Link
              href="#"
              onClick={handleLinkClick('/user/insightscan')}
              active={activeKey.toLowerCase() === '/user/insightscan'}
            >
              InsightScan
            </Nav.Link>
            <Nav.Link
              href="#"
              onClick={handleLinkClick('/user/dashboard')}
              active={activeKey.toLowerCase() === '/user/dashboard'}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link href="#" onClick={handleLinkClick('/')} active={activeKey.toLowerCase() === '/'}>
              About
            </Nav.Link>
            <Nav.Link href="#" onClick={logOutFunc} style={{color:"var(--white) !important"}}>
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNav;
