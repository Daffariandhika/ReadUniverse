import { Outlet } from 'react-router-dom';

import { SideBar } from './SideBar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-Darkness">
      <SideBar />
      <Outlet />
    </div>
  );
};

export default Layout;
