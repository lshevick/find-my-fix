import { Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { TbSelector } from "react-icons/tb";
import { FiCheck } from "react-icons/fi";

const ServicePicker = ({ items, setItems, serviceList, query, setQuery }) => {
  const filteredServices =
    query === ""
      ? serviceList
      : serviceList.filter((s) => {
          return s.toLowerCase().includes(query.toLowerCase());
        });
  return (
    <>
      <div className="flex flex-col items-center relative">
        <Combobox
          name="service_list"
          value={items}
          onChange={setItems}
          multiple
        >
          <div className="relative">
            <Combobox.Input
              displayValue={(items) => [...items]}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a service..."
              className="p-1 pr-10 rounded-md shadow-md text-base-content bg-base-100"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <TbSelector className="h-5 w-5 text-gray-400" />
            </Combobox.Button>
          </div>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
            as={Fragment}
          >
            <Combobox.Options className="bg-neutral-content/40 p-1 backdrop-blur-sm w-full border-2 border-stone-200/40 absolute top-8 z-20 rounded overflow-y-scroll max-h-[200px]">
              {filteredServices &&
                (filteredServices.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing Found.
                  </div>
                ) : (
                  filteredServices.map((s) => (
                    <Combobox.Option
                      key={s}
                      value={s}
                      className={({ active }) =>
                        `relative capitalize rounded transition-all cursor-default select-none py-2 pl-10 pr-2 ${
                          active
                            ? "bg-accent-focus text-white"
                            : "text-gray-900"
                        }`
                      }
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              items ? "font-medium" : "font-normal"
                            }`}
                          >
                            {s}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute text-2xl inset-y-0 left-0 flex items-center pl-3 ${
                                active ? "text-white" : "text-accent-focus"
                              }`}
                            >
                              <FiCheck />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                ))}
            </Combobox.Options>
          </Transition>
        </Combobox>
      </div>
    </>
  );
};

export default ServicePicker;
