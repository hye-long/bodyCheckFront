
import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';


const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  z-index: 1000;
`;

const Logo = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #000;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 30px;

  a {
    text-decoration: none;
    color: #000;
    font-size: 18px;
  }
`;

const Header: React.FC = () => {
    return (
        <HeaderContainer>
            <Logo>BODY : CHECK</Logo>
            <NavLinks>
                  <Link href="/login">로그인</Link>
                <Link href="/inquiry">문의하기</Link>
            </NavLinks>
        </HeaderContainer>
    );
};

export default Header;
