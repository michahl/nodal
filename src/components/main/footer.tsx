export default function Footer() {
    return (
        <footer className="mt-12">
          <div className="flex items-center justify-center pb-8">
            <span className="text-sm text-neutral-800">
              Made by
              <a
                href="https://github.com/michahl"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 rounded-full bg-neutral-100 px-2 py-1 text-neutral-950 hover:text-neutral-800"
              >
                @michahl
              </a>
              powered by <a href="https://sonar.perplexity.ai/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Sonar</a>
            </span>
          </div>
        </footer>
    )
}