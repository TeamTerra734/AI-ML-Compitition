import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import logo from "/icon.png";

function CustomNavbar() {
  const location = useLocation();
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
    
  });
  useEffect(() => {
    if (hasScrolledPast100) {
      setMyStyle({
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
      });
    } else {
      setMyStyle({
        
      });
    }
  }, [hasScrolledPast100]);
  return (
    <Navbar className='fixed-top' collapseOnSelect expand="lg" bg="dark" variant="dark" style={myStyle}>
      <Container>
        <Navbar.Brand href="/"><img src={logo} style={{height:"40px", margin:"0 10px 0 0"}}/>Satelizer</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/" active={activeKey == '/'}>
              Home
            </Nav.Link>
            <Nav.Link href="/InsightScan" active={(activeKey.toLowerCase() === '/insightscan')}>
              InsightScan
            </Nav.Link>
            <Nav.Link href="/user/adddata" active={(activeKey.toLowerCase() === '/user/adddata')} >
              User
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
