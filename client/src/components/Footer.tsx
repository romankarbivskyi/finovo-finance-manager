import { Link } from "react-router";
import { Github, Heart, Linkedin, Mail, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Finance Manager</h3>
            <p className="text-muted-foreground text-sm">
              Simple and effective financial goal tracking for everyone.
            </p>
            <div className="mt-2 flex items-center gap-3">
              <Link
                to="#"
                className="text-muted-foreground hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </Link>
              <Link
                to="#"
                className="text-muted-foreground hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </Link>
              <Link
                to="#"
                className="text-muted-foreground hover:text-primary"
                aria-label="GitHub"
              >
                <Github size={18} />
              </Link>
              <Link
                to="mailto:contact@financemanager.com"
                className="text-muted-foreground hover:text-primary"
                aria-label="Email"
              >
                <Mail size={18} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Quick Links</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Features</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link
                  to="/goals"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Goal Tracking
                </Link>
              </li>
              <li>
                <Link
                  to="/transactions"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Transaction Management
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Financial Overview
                </Link>
              </li>
              <li>
                <Link
                  to="/goals"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Multi-Currency Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/security"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-t pt-8 sm:flex-row">
          <p className="text-muted-foreground text-center text-sm">
            &copy; {currentYear} Finance Manager. All rights reserved.
          </p>
          <p className="text-muted-foreground mt-4 flex items-center text-sm sm:mt-0">
            Made with <Heart className="mx-1 h-4 w-4 text-red-500" /> by the
            Finance Manager Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
