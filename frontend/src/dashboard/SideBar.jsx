import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { FaFolderClosed, FaLifeRing } from 'react-icons/fa6';
import {
  HiBell,
  HiChartBar,
  HiChartPie,
  HiCog,
  HiOutlineChevronDoubleRight,
  HiShoppingBag,
  HiUser,
} from 'react-icons/hi';
import { RiFileUploadFill } from 'react-icons/ri';

import { useAuth } from '../contexts/AuthContext';

export const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    displayName: '',
    email: '',
    profileImage: '',
    role: '',
  });

  useEffect(() => {
    if (user && user.uid) {
      fetch(`${import.meta.env.VITE_API_URL}/user/${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          setUserData({
            displayName: data.username,
            email: data.email,
            profileImage: data.profileImage,
            role: data.role,
          });
        })
        .catch((err) => {
          console.error('Failed to load user data:', err);
          setUserData({
            displayName: '',
            email: '',
            profileImage: '',
            role: '',
          });
        });
    }
  }, [user]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative top-80">
      <button
        className={`fixed z-50 ${isOpen ? 'hidden' : 'block'}`}
        onClick={toggleSidebar}
      >
        <HiOutlineChevronDoubleRight
          className="hover:text-WhiteTransparent text-white duration-500"
          size={28}
        />
      </button>
      <div
        className={`fixed left-0 top-0 z-40 h-screen text-black shadow-lg transition-transform duration-100 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '16rem' }}
      >
        <div className="flex items-center gap-4 bg-Indigo p-6">
          <img
            alt="Profile"
            className="h-16 w-16 rounded-full border-2 border-Sky object-cover"
            src={
              userData.profileImage ||
              'https://laicos.com/wp-content/uploads/2018/10/avatar-blank.jpg'
            }
          />
          <div>
            <h4 className="text-lg font-semibold tracking-wider text-White">
              {userData.displayName}
            </h4>
            <p className="text-sm tracking-wide text-White">{userData.role}</p>
          </div>
        </div>
        <Sidebar aria-label="Sidebar navigation">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                className="hover:bg-tealBlueLight text-black hover:text-Sky"
                href="/admin/dashboard"
                icon={() => (
                  <HiChartPie
                    className="text-black"
                    size={25}
                  />
                )}
              >
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item
                className="hover:bg-tealBlueLight text-black hover:text-Sky"
                href="/admin/dashboard/upload"
                icon={() => (
                  <RiFileUploadFill
                    className="text-black"
                    size={25}
                  />
                )}
              >
                Upload Book
              </Sidebar.Item>
              <Sidebar.Item
                className="hover:bg-tealBlueLight text-black hover:text-Sky"
                href="/admin/dashboard/manage"
                icon={() => (
                  <FaFolderClosed
                    className="text-black"
                    size={25}
                  />
                )}
              >
                Manage Book
              </Sidebar.Item>

              {/* Admin-only section */}
              {userData.role === 'admin' && (
                <>
                  <Sidebar.Item
                    className="hover:bg-tealBlueLight text-black hover:text-Sky"
                    href="/admin/dashboard/users"
                    icon={() => (
                      <HiUser
                        className="text-black"
                        size={25}
                      />
                    )}
                  >
                    Manage Users
                  </Sidebar.Item>
                  <Sidebar.Item
                    className="hover:bg-tealBlueLight text-black hover:text-Sky"
                    href="/admin/dashboard/orders"
                    icon={() => (
                      <HiShoppingBag
                        className="text-black"
                        size={25}
                      />
                    )}
                  >
                    Manage Order
                  </Sidebar.Item>
                  <h5 className="text-shadowGray mt-6 px-4 text-sm font-semibold uppercase">
                    Admin Tools
                  </h5>
                  <Sidebar.Item
                    className="hover:bg-tealBlueLight text-black hover:text-Sky"
                    href="/admin/dashboard/analytics"
                    icon={() => (
                      <HiChartBar
                        className="text-black"
                        size={25}
                      />
                    )}
                  >
                    Analytics
                  </Sidebar.Item>
                </>
              )}
              {/* Always available */}
              <Sidebar.Item
                className="hover:bg-tealBlueLight text-black hover:text-Sky"
                href="/admin/dashboard/notifications"
                icon={() => (
                  <HiBell
                    className="text-black"
                    size={25}
                  />
                )}
              >
                Notifications
              </Sidebar.Item>
              <Sidebar.Item
                className="hover:bg-tealBlueLight text-black hover:text-Sky"
                href="/admin/dashboard/settings"
                icon={() => (
                  <HiCog
                    className="text-black"
                    size={25}
                  />
                )}
              >
                Settings
              </Sidebar.Item>
              <Sidebar.Item
                className="hover:bg-tealBlueLight text-black hover:text-Sky"
                href="/admin/dashboard/support"
                icon={() => (
                  <FaLifeRing
                    className="text-black"
                    size={25}
                  />
                )}
              >
                Support
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
      {isOpen && (
        <div
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
          role="button"
          tabIndex={0}
          onClick={toggleSidebar}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleSidebar();
            }
          }}
        />
      )}
    </div>
  );
};
