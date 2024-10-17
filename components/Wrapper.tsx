import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Breadcrumb } from "./Breadcrumb";
import { PrelineScript } from "./PrelineScripts";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "../hooks"
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";

interface WrapperProps {
    children: React.ReactNode;
}

export function Wrapper({ children }: WrapperProps) {
    const { loggedIn } = useAppSelector((state) => state.user);
    const path = usePathname();
    const { push } = useRouter();

    const fullPath = path.split("/").filter((item) => item !== "");

    useEffect(() => {
        if (!loggedIn) {
            push("/");
        } else if (path === "/") {
            push("/dashboard");
        }

        if (loggedIn && path === "/") {
            push("/dashboard");
        }
    }, [loggedIn, path]);

    if (loggedIn) {
        return (
            <>
                <div className="w-full max-w-[160rem] mx-auto">
                    <Header />
                    <Breadcrumb pathTrace={fullPath} />
                    <Sidebar active={fullPath} />
                    <div className="w-full min-h-screen lg:ps-64 p-5 bg-[#f4f6f9] text-black">
                        {children}
                        <ToastContainer />
                    </div>
                </div>
                <PrelineScript />
            </>
        );
    }

    return (
        <>
            <div>{children}</div>
            <PrelineScript />
        </>
    );
}
