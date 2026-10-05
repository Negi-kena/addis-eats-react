import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext.jsx';
import LogoMark from './LogoMark.jsx';
import './Footer.css';

/**
 * Lives inside <main>, after <Outlet />, so it's present at the bottom
 * of every screen's content and scrolls with the page — it "stacks"
 * under whatever route is currently rendered rather than being
 * re-mounted per page. Contact/social links are non-functional
 * placeholders (no real backend for this project) and are marked
 * aria-disabled so assistive tech doesn't announce them as live links.
 */
function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="app-footer__top">
        <div className="app-footer__brand">
          <div className="app-footer__brand-row">
            <LogoMark size={28} />
            <span>Addis Eats</span>
          </div>
          <p>Comfort and Balanced food delivered warm to your bed.</p>
        </div>

        <div className="app-footer__col">
          <h3>Quick links</h3>
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/menu">{t('nav.menu')}</Link>
          <Link to="/favorites">{t('nav.favorites')}</Link>
          <Link to="/orders">{t('nav.orders')}</Link>
        </div>

        <div className="app-footer__col">
          <h3>Get in touch</h3>
          <span className="app-footer__contact-line">
            <MapPin size={14} /> Megenagna, Addis Ababa
          </span>
          <span className="app-footer__contact-line">
            <Phone size={14} /> +251 91 784 3883
          </span>
          <span className="app-footer__contact-line">
            <Mail size={14} /> hello@addiseats.com
          </span>
        </div>
      </div>

      <div className="app-footer__bottom">
        <span>© {year} Addis Eats. Built By Negaso Kena.</span>
      </div>
    </footer>
  );
}

export default Footer;