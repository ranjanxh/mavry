import { AnchorLink } from '../ui/AnchorLink';
import { ToastButton } from '../ui/ToastButton';

export function Nav() {
  return (
    <header className="nav dk">
      <div className="wrap nav-in">
        <AnchorLink to="top" className="logo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="7" fill="#0F40FF" /><path d="M6 17V8.5l6 6 6-6V17" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Mavry
        </AnchorLink>
        <nav className="links" aria-label="Primary">
          <AnchorLink to="product">Product</AnchorLink>
          <AnchorLink to="workflow">How it works</AnchorLink>
          <AnchorLink to="sources">API and GitHub</AnchorLink>
          <AnchorLink to="faq">FAQ</AnchorLink>
        </nav>
        <div className="nav-r">
          <ToastButton className="login" message="Log in arrives with the app. The demo will skip sign-up entirely.">Log in</ToastButton>
          <AnchorLink to="product" className="btn b-blue">Explore the demo</AnchorLink>
        </div>
      </div>
    </header>
  );
}
