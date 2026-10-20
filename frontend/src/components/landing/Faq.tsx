const QUESTIONS: [string, string][] = [
  ['Is a page verified if an AI says it looks right?', 'No. A page or example is marked Verified only when a supported check actually ran and passed. AI can draft and suggest, but it never sets verification status.'],
  ['What does Mavry check today?', 'Examples against schemas, and API references against an OpenAPI specification. Freshness flags are also shown, labeled as a heuristic. Running code examples is planned, not available.'],
  ['Will AI change my published docs by itself?', 'No. Suggestions arrive as drafts with a diff and a link to their evidence. Someone has to approve them, and publishing is a separate action.'],
  ['Do I need a repository to start writing?', 'No. You can write and publish documentation first, then connect a repository and a spec when you’re ready.'],
  ['Is the GitHub connection real in this prototype?', 'No. The repository, commits, and pull requests are simulated demo data. A real connection comes later with a backend.'],
  ['What is a freshness warning?', 'A signal that a source file linked to a page has changed. It suggests a review, but it doesn’t prove an example is wrong.'],
];

export function Faq() {
  return (
    <section className="sec paper" id="faq" aria-labelledby="h-faq">
      <div className="wrap">
        <h2 className="h2" id="h-faq">Questions</h2>
        <div className="faq">
          {QUESTIONS.map(([q, a]) => (
            <details key={q}><summary>{q}</summary><p>{a}</p></details>
          ))}
        </div>
      </div>
    </section>
  );
}
