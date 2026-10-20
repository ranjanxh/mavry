import { AnchorLink } from '../ui/AnchorLink';
import { ToastButton } from '../ui/ToastButton';

export function Footer() {
  return (
    <footer className="dk">
      <div className="wrap">
        <div className="fgrid">
          <div>
            <AnchorLink to="top" className="logo">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="7" fill="#0F40FF" /><path d="M6 17V8.5l6 6 6-6V17" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Mavry
            </AnchorLink>
            <p style={{ maxWidth: '34ch', margin: '12px 0 0' }}>Documentation that keeps up with your code.</p>
          </div>
          <div><h4>Product</h4><AnchorLink to="product">Editor</AnchorLink><AnchorLink to="product">Verification</AnchorLink><AnchorLink to="sources">API reference</AnchorLink></div>
          <div><h4>Learn</h4><AnchorLink to="workflow">How it works</AnchorLink><AnchorLink to="faq">FAQ</AnchorLink></div>
          <div><h4>Account</h4><ToastButton message="Log in arrives with the app.">Log in</ToastButton><ToastButton message="Sign-up arrives with the app.">Sign up</ToastButton></div>
        </div>
        <div className="fbase">Prototype. All projects, repositories, and verification results shown are sample data.</div>
      </div>
    </footer>
  );
}
