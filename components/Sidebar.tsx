"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TbUserDollar, TbReportSearch } from "react-icons/tb";
import { GrTransaction } from "react-icons/gr";
import { AiOutlineAudit } from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { RxExit } from "react-icons/rx";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { RiSurroundSoundFill } from "react-icons/ri";
import { FaUsersViewfinder } from "react-icons/fa6";
import { logout } from "../api"
import Image from "next/image";

interface Props {
    active: string[];
}

export function Sidebar({ active }: Props) {
    const router = useRouter();
    return (
        <div
            id="application-sidebar"
            className="hs-overlay [--auto-close:lg]
  hs-overlay-open:translate-x-0
  -translate-x-full transition-all duration-300 transform
  w-[260px]
  hidden
  fixed inset-y-0 start-0 z-[60]
  bg-white border-e border-gray-200
  lg:block lg:translate-x-0 lg:end-auto lg:bottom-0
  dark:bg-neutral-800 dark:border-neutral-700
 "
        >
            <div className="px-8 pt-4">
                {/* Logo */}
                <Link
                    className="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-none focus:opacity-80"
                    href="/dashboard"
                    aria-label="WarpSpeed"
                >
                    <Image src="/warpspeedLogo.jpg" alt="" width={150} height={150} />
                </Link>
                {/* End Logo */}
            </div>

            <nav
                className="hs-accordion-group p-6 w-full flex flex-col flex-wrap"
                data-hs-accordion-always-open
            >
                <ul className="space-y-1.5">
                    <li>
                        <Link
                            className={`flex items-center gap-x-3.5 py-2 px-2.5 ${active[0] === "dashboard"
                                ? "bg-gray-300 dark:bg-gray-100 text-black dark:hover:text-white"
                                : "dark:bg-neutral-700 text-neutral-700 dark:text-white"
                                } text-sm  rounded-lg hover:bg-gray-100  dark:hover:bg-transparent`}
                            href="/dashboard"
                        >
                            <MdDashboard size={16} />
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={`flex items-center gap-x-3.5 py-2 px-2.5 ${active[0] === "merchant"
                                ? "bg-gray-300 dark:bg-gray-100 text-black dark:hover:text-white"
                                : "dark:bg-neutral-700 text-neutral-700 dark:text-white"
                                } text-sm  rounded-lg hover:bg-gray-100 dark:hover:bg-transparent`}
                            href="/merchant"
                        >
                            <TbUserDollar size={16} />
                            Merchants
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={`flex items-center gap-x-3.5 py-2 px-2.5 ${active[0] === "report"
                                ? "bg-gray-300 dark:bg-gray-100 text-black dark:hover:text-white"
                                : "dark:bg-neutral-700 text-neutral-700 dark:text-white"
                                } text-sm  rounded-lg hover:bg-gray-100 dark:hover:bg-transparent`}
                            href="/report"
                        >
                            <TbReportSearch size={16} />
                            Reports
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={`flex items-center gap-x-3.5 py-2 px-2.5 ${active[0] === "transaction"
                                ? "bg-gray-300 dark:bg-gray-100 text-black dark:hover:text-white"
                                : "dark:bg-neutral-700 text-neutral-700 dark:text-white"
                                } text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-transparent`}
                            href="/transaction"
                        >
                            <GrTransaction size={16} />
                            Transactions
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={`flex items-center gap-x-3.5 py-2 px-2.5 ${active[0] === "soundbox"
                                ? "bg-gray-300 dark:bg-gray-100 text-black dark:hover:text-white"
                                : "dark:bg-neutral-700 text-neutral-700 dark:text-white"
                                } text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-transparent`}
                            href="/soundbox"
                        >
                            <RiSurroundSoundFill size={16} />
                            Soundboxes
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={`flex items-center gap-x-3.5 py-2 px-2.5 ${active[0] === "activators"
                                ? "bg-gray-300 dark:bg-gray-100 text-black dark:hover:text-white"
                                : "dark:bg-neutral-700 text-neutral-700 dark:text-white"
                                } text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-transparent`}
                            href="/activators"
                        >
                            <FaUsersViewfinder size={16} />
                            Activators
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={`flex items-center gap-x-3.5 py-2 px-2.5 ${active[0] === "audit"
                                ? "bg-gray-300 dark:bg-gray-100 text-black dark:hover:text-white"
                                : "dark:bg-neutral-700 text-neutral-700 dark:text-white"
                                } text-sm  rounded-lg hover:bg-gray-100 dark:hover:bg-transparent`}
                            href="/audit"
                        >
                            <AiOutlineAudit size={16} />
                            Audit
                        </Link>
                    </li>
                    <li className="hs-accordion" id="settings-accordion">
                        <button
                            type="button"
                            className={`hs-accordion-toggle w-full text-start flex items-center ${active[0] === "settings"
                                ? "bg-gray-300 dark:bg-gray-100 text-black dark:hover:text-white"
                                : "dark:bg-neutral-700 text-neutral-700 dark:text-white"
                                } gap-x-3.5 py-2 px-2.5 hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent text-sm  rounded-lg  dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:hs-accordion-active:text-blue-600 hover:bg-gray-100 dark:hover:bg-transparent hs-accordion-active:hover:bg-gray-100 dark:hs-accordion-active:hover:bg-transparent`}
                        >
                            <IoMdSettings size={16} />
                            Settings
                            <FaChevronDown
                                className="hs-accordion-active:hidden ms-auto block size-4"
                                size={16}
                            />
                            <FaChevronUp
                                className="hs-accordion-active:block ms-auto hidden size-4"
                                size={16}
                            />
                        </button>
                        <div
                            id="settings-accordion-child"
                            className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
                        >
                            <ul className="py-2 ps-2 flex flex-col gap-2">
                                <li>
                                    <Link
                                        className={`flex items-center gap-x-3.5 py-2 px-2.5 ${active[0] === "settings" && active[1] === "roles"
                                            ? "bg-gray-300 dark:bg-gray-100 text-black dark:hover:text-white"
                                            : "dark:bg-neutral-700 text-neutral-700 dark:text-white"
                                            } text-sm  rounded-lg hover:bg-gray-100 dark:hover:bg-transparent`}
                                        href="/settings/roles"
                                    >
                                        Roles & Permissions
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className={`flex items-center gap-x-3.5 py-2 px-2.5 ${active[0] === "settings" && active[1] === "users"
                                            ? "bg-gray-300 dark:bg-gray-100 text-black dark:hover:text-white"
                                            : "dark:bg-neutral-700 text-neutral-700 dark:text-white"
                                            } text-sm  rounded-lg hover:bg-gray-100 dark:hover:bg-transparent`}
                                        href="/settings/users"
                                    >
                                        Users
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className={`flex items-center gap-x-3.5 py-2 px-2.5 ${active[0] === "settings" && active[1] === "others"
                                            ? "bg-gray-300 dark:bg-gray-100 text-black dark:hover:text-white"
                                            : "dark:bg-neutral-700 text-neutral-700 dark:text-white"
                                            } text-sm  rounded-lg hover:bg-gray-100 dark:hover:bg-transparent`}
                                        href="/settings/others"
                                    >
                                        Other Settings
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <button
                            onClick={() => {
                                console.log("Logout");
                                logout();
                                router.push("/");
                            }}
                            className="flex w-full rounded-lg items-center gap-x-3.5 py-2 px-2.5 text-sm text-black hover:bg-gray-100 dark:bg-neutral-700 dark:text-white dark:hover:bg-transparent"
                        >
                            <RxExit size={16} />
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
