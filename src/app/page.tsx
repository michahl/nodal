import UserAuthButton from "@/components/auth/userbutton";
import Explore from "@/components/main/explore";
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
            <Explore />
          </div>


          <div className="mx-auto mt-12">
            <div className="mx-auto mt-0 md:mt-20 max-w-md flex flex-col items-center mb-4">
              <span className="text-xs bg-neutral-200/60 rounded-full px-3 py-0.5">The Journey</span>
                <h3 className="inline-block text-center text-lg font-medium text-gray-900">
                How the app unfolds
                </h3>
            </div>

            <div className="mx-auto max-w-4xl flex flex-col md:flex-row items-around md:items-center justify-center md:justify-around gap-4 md:gap-8">
              <div className="flex flex-col justify-center text-center items-center">
                <span className="flex items-center justify-center text-2xl bg-amber-100 w-14 h-14 rounded-full">
                  🔍
                </span>
                <h4 className="mt-2 text-center font-medium text-gray-900">Ask your question</h4>
                <p className="text-sm text-neutral-800">Start with your curiosity and frame a meaningful question</p>
              </div>

              <div className="flex flex-col items-center rotate-90 md:rotate-0">
                <svg className="w-18 h-18 opacity-90" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 375.01 375.01" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M330.254,210.966c-56.916,1.224-110.16,25.704-167.076,28.764c-16.524,0.612-33.048-1.224-45.9-8.568 c23.256-4.283,45.288-12.239,61.812-27.54c17.749-15.911,19.584-45.287,8.568-66.095c-10.404-19.584-36.72-20.196-55.08-15.3 C89.125,132.63,59.75,184.65,84.229,221.369c-26.928,1.836-53.856,0-80.172,1.225c-5.508,0.611-5.508,8.567,0.612,8.567 c26.928,1.836,59.364,4.284,91.188,2.448c1.836,1.225,3.672,3.061,5.508,4.284c64.872,45.288,159.732-11.628,229.5-13.464 C338.821,223.817,338.821,210.354,330.254,210.966z M89.737,196.277c-6.732-25.091,15.3-46.511,35.496-56.916 c20.196-10.404,48.96-10.404,55.692,15.912c7.956,30.6-18.36,48.959-43.452,56.916c-11.628,3.672-22.644,6.12-34.272,7.344 C96.47,213.413,92.186,206.069,89.737,196.277z"></path> <path d="M371.869,211.577c-8.567-5.508-16.523-11.016-24.479-16.523c-6.732-4.896-13.464-10.404-21.42-12.24 c-6.12-1.836-12.24,7.344-6.732,11.627c6.732,4.896,14.076,9.18,20.809,13.464c4.896,3.061,9.792,6.732,14.075,9.792 c-4.896,2.448-9.792,4.284-14.688,6.732c-3.672,1.836-7.956,3.672-11.628,5.508c-1.224,0.612-2.448,1.836-3.061,3.06 c-1.836,2.448-0.611,1.225,0,0.612c-2.447,1.836-2.447,7.956,1.837,7.344l0,0c1.224,0.612,2.447,0.612,4.283,0.612 c4.284-1.224,9.181-3.06,13.464-4.896c9.181-3.673,18.36-7.345,26.929-12.24C376.153,220.758,376.153,214.025,371.869,211.577z"></path> </g> </g> </g></svg>
              </div>

              <div className="flex flex-col justify-center text-center items-center">
                <span className="flex items-center justify-center text-2xl bg-pink-100 w-14 h-14 rounded-full">
                  🧩
                </span>
                <h4 className="mt-2 text-center font-medium text-gray-900">Break it into logical steps</h4>
                <p className="text-sm text-neutral-800">Follow the guided path through interconnected knowledge</p>
              </div>

              <div className="flex flex-col items-center rotate-90 md:rotate-0">
                <svg className="w-18 h-18 opacity-90" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 375.01 375.01" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M330.254,210.966c-56.916,1.224-110.16,25.704-167.076,28.764c-16.524,0.612-33.048-1.224-45.9-8.568 c23.256-4.283,45.288-12.239,61.812-27.54c17.749-15.911,19.584-45.287,8.568-66.095c-10.404-19.584-36.72-20.196-55.08-15.3 C89.125,132.63,59.75,184.65,84.229,221.369c-26.928,1.836-53.856,0-80.172,1.225c-5.508,0.611-5.508,8.567,0.612,8.567 c26.928,1.836,59.364,4.284,91.188,2.448c1.836,1.225,3.672,3.061,5.508,4.284c64.872,45.288,159.732-11.628,229.5-13.464 C338.821,223.817,338.821,210.354,330.254,210.966z M89.737,196.277c-6.732-25.091,15.3-46.511,35.496-56.916 c20.196-10.404,48.96-10.404,55.692,15.912c7.956,30.6-18.36,48.959-43.452,56.916c-11.628,3.672-22.644,6.12-34.272,7.344 C96.47,213.413,92.186,206.069,89.737,196.277z"></path> <path d="M371.869,211.577c-8.567-5.508-16.523-11.016-24.479-16.523c-6.732-4.896-13.464-10.404-21.42-12.24 c-6.12-1.836-12.24,7.344-6.732,11.627c6.732,4.896,14.076,9.18,20.809,13.464c4.896,3.061,9.792,6.732,14.075,9.792 c-4.896,2.448-9.792,4.284-14.688,6.732c-3.672,1.836-7.956,3.672-11.628,5.508c-1.224,0.612-2.448,1.836-3.061,3.06 c-1.836,2.448-0.611,1.225,0,0.612c-2.447,1.836-2.447,7.956,1.837,7.344l0,0c1.224,0.612,2.447,0.612,4.283,0.612 c4.284-1.224,9.181-3.06,13.464-4.896c9.181-3.673,18.36-7.345,26.929-12.24C376.153,220.758,376.153,214.025,371.869,211.577z"></path> </g> </g> </g></svg>
              </div>

              <div className="flex flex-col justify-center text-center items-center">
                <span className="flex items-center justify-center text-2xl bg-green-100 w-14 h-14 rounded-full">
                  📚
                </span>
                <h4 className="mt-2 text-center font-medium text-gray-900">Explore, save, and revisit</h4>
                <p className="text-sm text-neutral-800">Dive deeper into sources and save your exploration journey</p>
              </div>

            </div>
          </div>
        </main>


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
      </div>
    </>
  );
}
