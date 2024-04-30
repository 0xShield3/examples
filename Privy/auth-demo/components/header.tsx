import {ArrowRightIcon} from '@heroicons/react/24/outline';
import PrivyLogo from './privy-logo';

export function Header() {
  return (
    <header className="flex shrink-0 grow-0 flex-col items-center gap-y-8 py-5 md:flex-row">
      <div className="grow-1 flex w-full items-center gap-x-2">
        <PrivyLogo className="text-privy-color-foreground-1 h-[22px] w-[70px]" />
        <div className=' text-xl'> & </div>
        <div className='flex items-center'>
          <div className="h-5 w-5 mr-1">
            <svg width="20" height="20" viewBox="0 0 481 483" fill="none" xmlns="http://www.w3.org/2000/svg">
            <title>Shield3 Image</title>
            <path d="M0.0425779 72.0683C-0.00757237 65.185 4.6323 59.1732 11.2609 57.4532L232.672 0V143.391H123.842C117.624 143.391 112.584 148.459 112.584 154.711V192.445C112.584 198.697 117.624 203.766 123.842 203.766H232.672V483C141.277 455.896 85.0503 404.458 50.8349 339.609H131.347C137.565 339.609 142.606 334.541 142.606 328.289V290.555C142.606 284.303 137.565 279.234 131.347 279.234H26.0369C6.18469 215.65 0.567133 144.065 0.0425779 72.0683Z" fill="#F4E065"/>
            <path d="M480.312 72.0693C480.362 65.186 475.722 59.1732 469.094 57.4532L247.682 0V143.391H356.512C362.73 143.391 367.771 148.459 367.771 154.711V192.445C367.771 198.697 362.73 203.766 356.512 203.766H247.682V279.234H356.512C362.73 279.234 367.771 284.303 367.771 290.555V328.289C367.771 334.541 362.73 339.609 356.512 339.609H247.682V483C446.888 423.925 479.021 249.241 480.312 72.0693Z" fill="#D5AE56"/>
            </svg>
          </div>
          <h1 className='text-xl font-medium'>Shield3</h1>
        </div>
        <div className="text-medium flex h-[22px] items-center justify-center rounded-[11px] border border-privy-color-accent px-[0.375rem] text-[0.75rem] text-privy-color-accent">
          Demo
        </div>
      </div>
      <div className='flex flex-col w-[800px]'>
      <div className="m-2 hidden shrink-0 grow-0 flex-col items-center gap-x-4 gap-y-2 rounded-[17px] pl-4 pr-1 text-[14px] md:flex md:h-[34px] md:flex-row md:bg-privy-color-background-2">
        Privy takes 9 minutes to set up
        <a
          href="https://privy.io/signup"
          target="_blank"
          rel="noreferrer"
          className="button button-primary flex items-center gap-x-2 rounded-[13px] px-3 py-2 text-[14px] text-white md:py-0"
        >
          Get started now
          <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
        </a>
      </div>
      <div className="m-2 hidden shrink-0 grow-0 flex-col items-center gap-x-4 gap-y-2 rounded-[17px] pl-4 pr-1 text-[14px] md:flex md:h-[34px] md:flex-row md:bg-privy-color-background-2">
        Shield3 takes 2 minutes to set up
        <a
          href="https://app.shield3.com"
          target="_blank"
          rel="noreferrer"
          className="button button-primary flex items-center gap-x-2 rounded-[13px] px-3 py-2 text-[14px] text-white md:py-0"
        >
          Configure Policies
          <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
        </a>
      </div>
      </div>
    </header>
  );
}
