import { AnchorLink } from '../ui/AnchorLink';
import { PaperDesk } from './PaperDesk';

export function Hero() {
  return (
    <section className="hero dk" aria-labelledby="h1">
      <div className="wrap">
        <h1 id="h1">Documentation that keeps up with your code.</h1>
        <p className="lede">
          Write, publish, and maintain technical documentation with verification tied to your source code. Find broken
          examples, trace API changes, and review evidence-backed updates in one workflow.
        </p>
        <div className="ctas">
          <AnchorLink to="product" className="btn b-white lg">Explore the demo</AnchorLink>
          <AnchorLink to="workflow" className="btn b-line lg">See how verification works</AnchorLink>
        </div>
        <p className="scope">Checks examples against your OpenAPI spec today. Running code examples is on the roadmap.</p>
        <PaperDesk />
      </div>
    </section>
  );
}
