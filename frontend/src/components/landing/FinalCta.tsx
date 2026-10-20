import { AnchorLink } from '../ui/AnchorLink';
import { ToastButton } from '../ui/ToastButton';

export function FinalCta() {
  return (
    <section className="sec blue cta dk" aria-labelledby="h-cta">
      <div className="wrap">
        <p className="hand" aria-hidden="true">go on, press the stamp</p>
        <h2 className="h2" id="h-cta">See which of your examples still work.</h2>
        <p className="sub">Open the demo workspace and follow a real-looking change from commit to approved fix.</p>
        <div className="ctas">
          <AnchorLink to="product" className="btn b-white lg">Explore the demo</AnchorLink>
          <ToastButton className="btn b-line lg" message="Sign-up arrives with the app. Demo access won’t need an account.">Create a workspace</ToastButton>
        </div>
      </div>
    </section>
  );
}
