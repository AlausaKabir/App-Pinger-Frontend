"use client";
import { MdNavigateNext } from "react-icons/md"
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb"


interface Props {
    pathTrace?: string[];
}

export function Breadcrumb({ pathTrace = [] }: Props) {
    return (
        <div className="sticky top-0 inset-x-0 z-20 bg-white border-y px-4 sm:px-6 md:px-8 lg:hidden dark:bg-neutral-800 dark:border-neutral-700">
            <div className="flex justify-between items-center py-2">
                {/* Breadcrumb */}
                <ol className="ms-3 flex items-center whitespace-nowrap">
                    {pathTrace.length === 0 && (
                        <li className="flex items-center text-sm  font-semibold text-gray-800 dark:text-neutral-400">
                            Dashboard
                        </li>
                    )}
                    {pathTrace.map((path, index) => {
                        const text = path.charAt(0).toUpperCase() + path.slice(1);
                        return (
                            <li
                                key={index}
                                className={`flex items-center text-sm ${index + 1 === pathTrace.length ? "font-semibold" : ""
                                    } text-gray-800 dark:text-neutral-400`}
                            >
                                {text}
                                {index < pathTrace.length - 1 && (
                                    <MdNavigateNext
                                        size={20}
                                        className="text-gray-400 dark:text-neutral-500"
                                    />
                                )}
                            </li>
                        );
                    })}
                </ol>
                {/* End breadcrumb */}

                {/* sidebar */}
                <button
                    type="button"
                    className="py-2 px-3 flex justify-center items-center gap-x-1.5 text-xs rounded-lg border border-gray-200 text-gray-500 hover:text-gray-600 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                    data-hs-overlay="#application-sidebar"
                    aria-controls="application-sidebar"
                    aria-label="Sidebar"
                >
                    <TbLayoutSidebarLeftExpandFilled size={16} />
                    <span className="sr-only">Sidebar</span>
                </button>
                {/* end sidebar */}
            </div>
        </div>
    );
}
