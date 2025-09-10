import { Mail, Phone, MapPin, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-accent" />
                <span className="text-sm">
                  Virac, Catanduanes<br />
                  Philippines 4800
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent" />
                <span className="text-sm">(052) 811-1234</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent" />
                <span className="text-sm">info@ficelco.coop</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="/billing" className="block text-sm hover:text-muted-foreground transition-colors">
                Billing Inquiry
              </a>
              <a href="/services" className="block text-sm hover:text-muted-foreground transition-colors">
                Member Services
              </a>
              <a href="/news" className="block text-sm hover:text-muted-foreground transition-colors">
                Latest News
              </a>
              <a href="/contact" className="block text-sm hover:text-muted-foreground transition-colors">
                Contact Us
              </a>
            </div>
          </div>

          {/* About & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <p className="text-sm mb-4 text-muted-foreground">
              Powering communities in Catanduanes with reliable, affordable electricity.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="hover:text-muted-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="hover:text-muted-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 First Catanduanes Electric Cooperative, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;