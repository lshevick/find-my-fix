// import { useState } from 'react';
import { BiArrowToBottom } from "react-icons/bi";

const Homescreen = () => {
  return (
    <>
      <div className="w-full bg-stone-100">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] w-full bg-stone-100">
          <div>
            <h1 className="font-extrabold text-7xl text-red-900">
              Find <span className="text-stone-300">My</span> Fix
            </h1>
            <p className="font-md text-2xl">An Automotive Shop Locator</p>
          </div>
        </div>
          <div className="w-full flex flex-col items-center">
            <span className="text-3xl"><BiArrowToBottom className="animate-bounce"/></span>
          </div>
          <div className="flex flex-col items-center justify-center min-h-screen bg-stone-400 mt-12">
            <h2 className="text-5xl">some content here about this app and how to use it</h2>
          </div>
      </div>
    </>
  );
};

export default Homescreen;