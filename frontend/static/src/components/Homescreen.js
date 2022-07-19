// import { useState } from 'react';
import { BiArrowToBottom } from "react-icons/bi";

const Homescreen = () => {
  return (
    <>
      <div className="w-full bg-base-100">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] w-full bg-base-100">
          <div>
            <h1 className="font-extrabold text-7xl text-success">
              Find <span className="text-accent-focus">My</span> Fix
            </h1>
            <p className="font-md text-2xl">An Automotive Shop Locator</p>
          </div>
        </div>
        <div className="w-full flex flex-col items-center">
          <span className="text-3xl">
            <BiArrowToBottom className="animate-bounce" />
          </span>
        </div>
        <div className="flex flex-col items-center md:grid md:grid-cols-4 md:grid-flow-row md:gap-4 justify-center min-h-screen bg-neutral text-neutral-content text-lg mt-12 p-4 px-10">
          <div className="col-start-2 col-span-2 my-48">
            <h2 className="text-7xl font-semibold">
              Welcome <br />
              to <br />
              Find My Fix
            </h2>
            <p className="my-2 text-3xl font-light">
              Here's some info on how to use this app:
            </p>
          </div>
          <div className="col-start-2 col-span-2 card bg-accent text-stone-100 shadow-xl mb-10">
            <div className="card-body">
              <h3 className="card-title">
                About
              </h3>
              <p>
              This app was created to help people find local automotive shops that can cater to their needs. 
              </p>
            </div>
          </div>
          <div className="col-span-4 row-start-3 md:w-5/6 md:mx-auto">
            <img
              src={require("../images/search_screen.png")}
              alt="search screen"
            />
          </div>
          <div className="col-start-1 row-start-4 col-span-2 card bg-accent-focus text-stone-100 my-10 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">
               Add your car
              </h3>
              <p>
                After logging in, you can save your cars to you garage where you can manage the work your car needs.
              </p>
            </div>
          </div>
          <div className="col-start-3 col-span-2 lg:w-5/6 mx-auto">
            <img
              src={require("../images/garage_img.png")}
              alt="garage"
              width="100%"
              className="my-10"
            />
          </div>
          <div className="card bg-teal-700 text-stone-100 shadow-xl my-10 col-start-1 col-span-2">
            <div className="card-body">
              <h3 className="card-title">
                Filtering your Searches
              </h3>
              <p>
                By using the filter and sorting menus on the search page, you can get as specific or as broad as you would like.
              </p>
            </div>
          </div>
          <div className="md:col-start-3 md:col-span-2 lg:w-5/6 mx-auto relative">
            <img
              src={require("../images/filter_section.png")}
              alt="filter section"
            />
          </div>
          <div className="card shadow-xl bg-emerald-800 text-stone-100 my-10 col-start-1 col-span-2">
            <div className="card-body">
              <h3 className="card-title">
                Preview Cards
              </h3>
              <p>
              The shop preview card are a quick glance at what the shop had to offer
              </p>
            </div>
          </div>
          <div className="col-start-3 col-span-2 md:row-start-6 md:w-5/6 mx-auto">
            <img src={require("../images/shop_card.png")} alt="shop card" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Homescreen;
