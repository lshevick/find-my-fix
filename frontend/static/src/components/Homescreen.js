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
        <div className="flex flex-col items-center md:grid md:grid-cols-4 md:grid-flow-row md:gap-4 justify-center min-h-screen bg-neutral text-neutral-content text-lg mt-12 p-2">
          <div className="col-start-2 col-span-2 my-48">
            <h2 className="text-5xl font-medium">
              Welcome <br />
              to <br />
              Find my Fix
            </h2>
            <p className="my-2 text-xl font-light">
              Here's some info on how to use this app:
            </p>
          </div>
          <div className="col-start-1 col-span-2 card bg-accent-focus shadow-xl mb-10">
            <div className="card-body">
              <h3 className="card-title">
                <span>1.</span> Create an account
              </h3>
              <p>
                Without an account, you will only be able to see local shops and
                their reviews.
                <br /> With an account, you will have more options to filter
                shops by and also be able to write your own reviews if you had
                work done by the shop.
              </p>
            </div>
          </div>
          <div className="col-start-3 row-start-3 col-span-2 card bg-emerald-800 my-10 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">
                <span>2:</span> Add your car
              </h3>
              <p>
                After creating an account, you will see this dashboard screen,
                here you can click on add a car, and that will take you to a
                form. After adding a car, work needed for the car, and your
                location you then will be taken to the search screen.
              </p>
            </div>
          </div>
          <div className="col-start-1 col-span-2">
            <img
              src={require("../images/garage_img.png")}
              alt="garage"
              width="100%"
              className="my-10"
            />
          </div>
          <div className="card bg-teal-700 shadow-xl my-10 col-start-1 col-span-2">
            <div className="card-body">
              <h3 className="card-title">Filtering your Searches</h3>
              <p>
                These dropdown menus are how you will be filtering and sorting
                the results. The topmost menu is where you can choose from your
                saved cars which one you would like to search with. <br />
                <br />
                The bottom left menu is for sorting the shops by distance,
                average ratings, and lastly by how many of the added work items
                that shops can complete. <br />
                <br />
                The bottom right menu is for filtering shops by a specific
                service, for example, if your car has several work items on it,
                but you were just looking to have one of them done for now, you
                could filter the shops by that particular service.
              </p>
            </div>
          </div>
          <div className="col-start-3 relative">
            <img
              src={require("../images/filter_section.png")}
              alt="filter section"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Homescreen;
