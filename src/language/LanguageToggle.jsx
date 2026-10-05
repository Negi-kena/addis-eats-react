import { useState, useRef, useEffect } from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from './LanguageContext.jsx';
import './LanguageToggle.css';

function LanguageToggle() {
  const { lang, setLang, languages } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('pointerdown', handleClick);
    return () => document.removeEventListener('pointerdown', handleClick);
  }, []);

  const current = languages.find((l) => l.code === lang);

  return (
    <div className="lang-toggle" ref={rootRef}>
      <button
        type="button"
        className="lang-toggle__btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${current?.label ?? lang}`}
        title="Change language"
      >
        <Languages size={18} />
      </button>

      {open && (
        <ul className="lang-toggle__menu" role="listbox" aria-label="Select language">
          {languages.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === lang}
                className={`lang-toggle__option${l.code === lang ? ' lang-toggle__option--active' : ''}`}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LanguageToggle;