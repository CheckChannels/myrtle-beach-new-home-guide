import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { StickyContactBar } from './StickyContactBar';

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <StickyContactBar />
    </div>
  );
}
