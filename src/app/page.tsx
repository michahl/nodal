import UserAuthButton from "@/components/auth/userbutton";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="relative mx-auto flex h-dvh w-full max-w-6xl flex-col px-6 md:px-8 lg:px-12">
        <header className="flex items-center justify-between py-8">
          <Link href="/">
            <span className="text-neutral-950">gnosei</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="https://github.com/michahl/gnosei" target="_blank">
              <GitHubLogoIcon className="h-6 w-6 text-neutral-800 transition-colors hover:text-neutral-600" />
            </Link>
            <UserAuthButton />
          </nav>
        </header>
        <main className="flex-1">
          <div className="relative pb-12 pt-8">
            <div className='absolute left-0 top-0 -z-10 h-full w-full'>
              <div className='relative h-full w-full bg-white'>
                <div className='-z-1 left-0 h-full w-full bg-[radial-gradient(#eaeaea_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_60%_at_50%_50%,#000_70%,transparent_100%)]' />
              </div>
            </div>
            <div className='relative mx-auto flex max-w-2xl flex-col items-center'>
              <h2 className='inline-block text-center text-xl font-medium text-gray-900'>
                Follow your curiosity, step by step
              </h2>
              <p className='mt-6 text-center text-lg leading-6 text-gray-600'>
                The internet is full of answers — but understanding takes steps. This app breaks your big questions into logical, trustworthy paths, so you can learn the way your mind actually thinks.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-xl">
            <form className="flex items-center">
              <input 
                type="text"
                className="w-full border border-neutral-200 px-3 py-1.5 rounded-l-lg focus:outline-none"
                placeholder="eg. How money inflation works?"
              />
              <button 
                type="submit"
                className="text-neutral-50 border border-neutral-800 bg-neutral-800 px-4 py-1.5 rounded-r-lg hover:bg-neutral-600"
              >
                Explore
              </button>
            </form>
          </div>
        </main>
        <footer>
          <div className="flex items-center justify-center py-8">
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
      </div>
    </>
  );
}
