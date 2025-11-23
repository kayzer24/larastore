import { login, logout, register, welcome } from '@/routes';
import type { SharedData } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import MiniCartDropdown from '@/components/front/mini-cart-dropdown';
import profile from '@/routes/profile';
import product from '@/routes/product';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { FormEventHandler } from 'react';

function Navbar() {
    const { auth, departments, keyword } = usePage<SharedData>().props;
    {
        console.log(departments);}
    const searchForm = useForm<{
        keyword: string;
    }>({
        keyword: keyword || '',
    })
    const {url} = usePage();

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        searchForm.get(url, {
           preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <>
            <div className="navbar bg-primary text-primary-content">
                <div className="flex-1">
                    <Link href={welcome()} className="btn text-xl btn-ghost">
                        Larastore
                    </Link>
                </div>
                <div className="flex gap-2">
                    <form onSubmit={onSubmit} className="join flex-1">
                        <div className="flex-1">
                            <input type="text"
                                   value={searchForm.data.keyword}
                                   onChange={(e) => searchForm.setData('keyword', e.target.value)}
                                   className="input input-bordered join-item w-full"
                                   placeholder="Search"
                            />
                        </div>
                        <div className="indicator">
                            <button className="btn btn-neutral join-item">
                                <MagnifyingGlassIcon className="size-4" />
                            </button>
                        </div>
                    </form>
                    <MiniCartDropdown />
                    {/*<button className="btn btn-circle btn-ghost">*/}
                    {/*    <div className="indicator">*/}
                    {/*        <svg*/}
                    {/*            xmlns="http://www.w3.org/2000/svg"*/}
                    {/*            className="h-5 w-5"*/}
                    {/*            fill="none"*/}
                    {/*            viewBox="0 0 24 24"*/}
                    {/*            stroke="currentColor"*/}
                    {/*        >*/}
                    {/*            <path*/}
                    {/*                strokeLinecap="round"*/}
                    {/*                strokeLinejoin="round"*/}
                    {/*                strokeWidth="2"*/}
                    {/*                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"*/}
                    {/*            />*/}
                    {/*        </svg>*/}
                    {/*        <span className="indicator-item badge badge-xs"></span>*/}
                    {/*    </div>*/}
                    {/*</button>*/}
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
                                    <Link href={profile.edit().url} className="justify-between">
                                        Profile
                                        <span className="badge">New</span>
                                    </Link>
                                </li>
                                <li>
                                    <a>Settings</a>
                                </li>
                                <li>
                                    <Link
                                        href={logout()}
                                        method={'post'}
                                        as={'button'}
                                    >
                                        Logout
                                    </Link>
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
            <div className="navbar bg-neutral text-white shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul tabIndex={-1} className="menu menu-sm dropdown-content bg-primary rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {departments.map((department) => (
                                <li key={department.id}>
                                    {<Link href={product.byDepartment(department.slug)}>{department.name}</Link>}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1">
                            {departments.map((department) => (
                                <li key={department.id}>
                                    {<Link href={product.byDepartment(department.slug)}>{department.name}</Link>}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;
