export default function Home() {
  return (
    <>
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
    </>
  );
}
