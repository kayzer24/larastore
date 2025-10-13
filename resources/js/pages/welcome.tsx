import { login, logout, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="navbar bg-primary text-primary-content">
                <div className="flex-1">
                    <a className="btn text-xl btn-ghost">Larastore</a>
                </div>
                <div className="flex gap-2">
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-circle btn-ghost"
                        >
                            <div className="indicator">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                <span className="indicator-item badge badge-sm badge-error">
                                    8
                                </span>
                            </div>
                        </div>
                        <div
                            tabIndex={0}
                            className="card-compact dropdown-content card z-1 mt-3 w-52 bg-base-100 shadow"
                        >
                            <div className="card-body">
                                <span className="text-lg font-bold">
                                    8 Items
                                </span>
                                <span className="text-info">
                                    Subtotal: $999
                                </span>
                                <div className="card-actions">
                                    <button className="btn btn-block btn-primary">
                                        View cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> </svg>
                            <span className="badge badge-xs indicator-item"></span>
                        </div>
                    </button>
                    {auth.user ? (
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn avatar btn-circle btn-ghost"
                            >
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS Navbar component"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                    />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu z-1 mt-3 w-52 menu-sm rounded-box bg-base-100 p-2 shadow"
                            >
                                <li>
                                    <a className="justify-between">
                                        Profile
                                        <span className="badge">New</span>
                                    </a>
                                </li>
                                <li>
                                    <a>Settings</a>
                                </li>
                                <li>
                                    <Link href={logout()} method={"post"} as={"button"}>Logout</Link>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <>
                            <Link href={login()} className="btn btn-ghost">
                                Log in
                            </Link>
                            <Link href={register()} className="btn btn-primary">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <div className="">
                <div className="hero h-[300px] bg-base-200">
                    <div className="hero-content text-center">
                        <div className="max-w-md">
                            <h1 className="text-5xl font-bold">Hello there</h1>
                            <p className="py-6">
                                Provident cupiditate voluptatem et in. Quaerat
                                fugiat ut assumenda excepturi exercitationem
                                quasi. In deleniti eaque aut repudiandae et a id
                                nisi.
                            </p>
                            <button className="btn btn-primary">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
