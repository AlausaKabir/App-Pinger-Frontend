"use client";
import { useTheme } from "./ThemeProvider"
import { CiSearch, CiUser } from "react-icons/ci";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";

export function Header() {
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            <header className="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[48] w-full bg-white border-b text-sm py-2.5 sm:py-4 lg:ps-64 dark:bg-neutral-800 dark:border-neutral-700">
                <nav
                    className="flex basis-full items-center w-full mx-auto px-4 sm:px-6"
                    aria-label="Global"
                >
                    <div className="me-5 lg:me-0 lg:hidden">
                        {/* Logo */}
                        <Link
                            className="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-none focus:opacity-80"
                            href="/dashboard"
                            aria-label="WarpSpeed"
                        >
                            <Image
                                src="/warpspeedLogo.jpg"
                                alt="warpspeed"
                                width={150}
                                height={150}
                            />
                        </Link>
                        {/* End logo */}
                    </div>

                    <div className="w-full flex items-center justify-end ms-auto sm:justify-between sm:gap-x-3 sm:order-3">
                        <div className="sm:hidden">
                            <button
                                type="button"
                                className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
                            >
                                <svg
                                    className="flex-shrink-0 size-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.3-4.3" />
                                </svg>
                            </button>
                        </div>

                        <div className="hidden sm:block">
                            <label htmlFor="icon" className="sr-only">
                                Search
                            </label>
                            <div className="relative min-w-72 md:min-w-80">
                                <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                                    <CiSearch size={16} className="text-neutral-500" />
                                </div>
                                <input
                                    type="text"
                                    id="icon"
                                    name="icon"
                                    className="py-2 px-4 ps-11 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                    placeholder="Search"
                                />
                            </div>
                        </div>

                        <div className="flex flex-row items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className={`hs-dark-mode-active:hidden ${theme === "light" ? "flex" : "hidden"
                                    }  hs-dark-mode group items-center text-gray-600 hover:text-blue-600 font-medium dark:text-neutral-400 dark:hover:text-neutral-500`}
                                data-hs-theme-click-value="dark"
                            >
                                <MdOutlineDarkMode size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className={`hs-dark-mode-active:block ${theme === "light" ? "hidden" : "flex"
                                    } hs-dark-mode group items-center text-gray-600 hover:text-blue-600 font-medium dark:text-neutral-400 dark:hover:text-neutral-500`}
                                data-hs-theme-click-value="light"
                            >
                                <MdOutlineLightMode size={20} />
                            </button>

                            <div className="hs-dropdown [--placement:bottom-right] relative inline-flex">
                                <button
                                    id="hs-dropdown-with-header"
                                    type="button"
                                    className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-black hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
                                >
                                    <CiUser size={20} />
                                </button>

                                <div
                                    className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2 dark:bg-neutral-900 dark:border dark:border-neutral-700"
                                    aria-labelledby="hs-dropdown-with-header"
                                >
                                    <div className="py-3 px-5 -m-2 bg-gray-100 rounded-t-lg dark:bg-neutral-800">
                                        <p className="text-sm text-gray-500 dark:text-neutral-400">
                                            Signed in as
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-neutral-300">
                                            james@site.com
                                        </p>
                                    </div>
                                    <div className="mt-2 py-2 first:pt-0 last:pb-0">
                                        <Link
                                            className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                                            href="#"
                                        >
                                            <CiUser size={20} />
                                            Profile
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
}
