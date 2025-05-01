import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Home,
  LibraryBig,
  UsersRound,
  UploadCloud,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openMobile, setOpenMobile] = useState(false);

  const isAdmin = user?.role === "admin";

  const adminLinks = [
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Bulk Upload",
      path: "/admin/bulk-upload",
      icon: <UploadCloud size={18} />,
    },
  ];

  const studentLinks = [
    { name: "Home", path: "/student-dashboard", icon: <Home size={18} /> },
    { name: "Library", path: "/library", icon: <LibraryBig size={18} /> },
    { name: "Info", path: "/info", icon: <UsersRound size={18} /> },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-700 tracking-tight flex items-center gap-1"
        >
          Smart<span className="text-indigo-900">Library</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-6 items-center">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-4">
              {links.map((link, i) => (
                <NavigationMenuItem key={i}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-700 transition"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="gap-2 text-sm"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setOpenMobile(!openMobile)}
        >
          {openMobile ? (
            <X size={24} className="text-indigo-700" />
          ) : (
            <Menu size={24} className="text-indigo-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {openMobile && (
        <div className="md:hidden bg-white border-t px-6 py-4 space-y-4">
          {links.map((link, i) => (
            <Link
              key={i}
              to={link.path}
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-700 font-medium"
              onClick={() => setOpenMobile(false)}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <Button
            onClick={() => {
              handleLogout();
              setOpenMobile(false);
            }}
            className="w-full gap-2 mt-2"
            variant="destructive"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
