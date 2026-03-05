import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { MoreVertical } from 'lucide-react';

const DropdownMenu = ({ buttonIcon, items }) => {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex justify-center w-full rounded-md p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                    {buttonIcon || <MoreVertical size={18} />}
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <div className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="px-1 py-1">
                        {items.map((group, groupIndex) => (
                            <div key={groupIndex} className="py-1">
                                {group.map((item) => (
                                    <Menu.Item key={item.label}>
                                        {({ active }) => (
                                            <button
                                                onClick={item.onClick}
                                                disabled={item.disabled}
                                                className={`${active ? 'bg-primary text-white' : 'text-gray-900'
                                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-50 ${item.className || ''}`}
                                            >
                                                {item.icon && <span className="mr-2 h-5 w-5">{item.icon}</span>}
                                                {item.label}
                                            </button>
                                        )}
                                    </Menu.Item>
                                ))}
                                {/* Add separator if not the last group */}
                                {groupIndex < items.length - 1 && <hr className="my-1" />}
                            </div>
                        ))}
                    </div>
                </div>
            </Transition>
        </Menu>
    );
};

export default DropdownMenu;