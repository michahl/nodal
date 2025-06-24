import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-12">
          <div className="flex flex-col items-center justify-center pb-4">
            <div>
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

            <div className="mt-2 flex gap-4 text-sm text-neutral-500">
                <Link href='/terms' className="cursor-pointer hover:text-neutral-600">Terms</Link>
                <Link href='/privacy' className="cursor-pointer hover:text-neutral-600">Privacy</Link>
            </div>
          </div>
        </footer>
    )
}