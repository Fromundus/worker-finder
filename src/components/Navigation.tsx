import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Briefcase, HeartPulse, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import logo from "../assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false); // for mobile collapse
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background shadow-[var(--shadow-card)] sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              {/* <img src={logo} alt="FICELCO Logo" /> */}
              <Briefcase className="size-8" />
            </div>
            <span className="text-xl font-bold text-foreground hidden md:block">Catanduanes Worker Finder</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <div className="ml-4 flex items-center gap-4">
              <Link to={'/login'}>
                <Button>
                  Login
                </Button>
              </Link>
              <Link to={'/register'}>
                <Button variant="outline">
                  Signup
                </Button>
              </Link>
              <ThemeToggle />
            </div>

          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="lg:hidden flex items-center space-x-4">
            <Link to={'/login'}>
              <Button>
                Login
              </Button>
            </Link>
            <Link to={'/register'}>
              <Button variant="outline">
                Signup
              </Button>
            </Link>
            <ThemeToggle />
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button> */}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
