import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RootLayout = () => {
  return (
    <>
      <Header />
      <div className='min-h-screen px-12 pt-4'>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default RootLayout;