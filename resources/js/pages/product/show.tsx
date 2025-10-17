import React, { useEffect, useMemo, useState } from 'react';
import { Product, type SharedData, VariationTypeOption } from '@/types';
import { Head, useForm, usePage, router, Link } from '@inertiajs/react';
import Carousel from '@/components/ui/carousel';
import CurrencyFormatter from '@/components/currency-formatter';
import { arraysAreEqual } from '@/helpers';
import { login, logout, register } from '@/routes';
import { route } from 'ziggy-js';

function Show({ product, variationOptions }: {product:Product, variationOptions: number[]}) {
    const form = useForm<{
        options_ids: Record<string, number>;
        quantity: number;
        price: number | null;
    }>({
        options_ids: {},
        quantity: 1,
        price: null,
    });

    const { auth } = usePage<SharedData>().props;
    const url = usePage();

    const [selectedOptions, setSelectedOptions] = useState<Record<number, VariationTypeOption>>([]);

    const images = useMemo(() => {
        for (const typeId in selectedOptions) {
            const option = selectedOptions[typeId];
            if (option.images.length > 0) return option.images;
        }

        return product.images;

    }, [product, selectedOptions]);

    const computedProduct = useMemo(() => {
        const selectedOptionIds =  Object.values(selectedOptions)
            .map(op => op.id)
            .sort();

        for (const variation of product.variations) {
            const optionIds = variation.variation_type_option_ids.sort();

            if (arraysAreEqual(selectedOptionIds, optionIds)) {
                return {
                    price: variation.price,
                    quantity: variation.quantity === null ? Number.MAX_VALUE : variation.quantity,

                }
            }
        }
        return {
            price: product.price,
            quantity: product.quantity,
        }
    }, [product, selectedOptions]);

    useEffect(() => {
        for (const type of product.variationTypes) {
            const selectedOptionId:number = variationOptions[type.id];
            console.log(selectedOptionId, type.options);
            chooseOption(
                type.id,
                type.options.find(op => op.id == selectedOptionId) || type.options[0],
                false,
            );
        }
    }, []);

    const getOptionIdsMap = (newOptions: object) => {
        return Object.fromEntries(
            Object.entries(newOptions).map(([a, b]) => [a, b.id])
        );
    }

    const chooseOption = (
        typeId: number,
        option: VariationTypeOption,
        updateRouter: boolean = true
    )=> {
        setSelectedOptions((prevSelectedOptions) => {
            const newOptions = {
                ...prevSelectedOptions,
                [typeId]: option
            }

            if (updateRouter) {
                router.get(url.url, {
                    options: getOptionIdsMap(newOptions)
                }, {
                    preserveScroll: true,
                    preserveState: true
                })
            }

            return newOptions;
        })
    };

    const onQuantityChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
        form.setData('quantity', parseInt(ev.target.value))
    };

    const addToCart = () => {
        form.post(route('cart.store', product.id), {
            preserveScroll: true,
            preserveState: true,
            onError: (err) => {
                console.log(err);
            }
        })
    };

    const renderProductVariationTypes = () => {
        return (
            product.variationTypes.map((type) => (
                <div key={type.id}>
                    <b>{type.name}</b>
                    {type.type === 'Image' &&
                    <div className="flex gap-2 mb-4">
                        {type.options.map(option => (
                            <div key={option.id} onClick={() => chooseOption(type.id, option)}>
                                {option.images && option.images.length > 0 &&
                                    <img
                                        src={option.images[0].thumb}
                                        alt=""
                                        className={'w-[50px]' + (selectedOptions[type.id]?.id === option.id ? 'outline outline-4 outline-primary' : '')}
                                    />
                                }
                            </div>
                        ))}
                    </div>}
                    {type.type === 'Radio' &&
                        <div className="flex join mb-4">
                            {type.options.map(option => (
                                <input
                                    onChange={() => chooseOption(type.id, option)}
                                    key={option.id}
                                    className="join-item btn"
                                    type='radio'
                                    value={option.id}
                                    checked={selectedOptions[type.id]?.id === option.id}
                                    name={'variation_type_' + type.id}
                                    aria-label={option.name}
                                />
                            ))}
                    </div>}
                </div>
            ))
        );
    }

    const renderAddToCartButton = () => {
        return (
            <div className="mb-8 flex gap-4">
                <select
                    value={form.data.quantity}
                    onChange={onQuantityChange}
                    className="select select-bordered w-full"
                >
                    {Array.from({
                        length:Math.min(10, computedProduct.quantity)
                    }).map((el, i) => (
                        <option value={i+1} key={i+1}>Quantity: {i+1}</option>
                    ))}
                </select>
                <button className="btn btn-primary" onClick={addToCart}>Add to Cart</button>
            </div>
        );
    }

    useEffect(() => {
        const idsMap = Object.fromEntries(
            Object.entries(selectedOptions).map(([typeId, option]: [string, VariationTypeOption])=> [typeId, option.id])
        );
        console.log(idsMap);
        form.setData('options_ids', idsMap);
    }, [selectedOptions]);

    return (
        <>
            <Head title={product.title} />
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
            <div className="container mx-auto p-8">
                <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">
                    <div className="col-span-7">
                        <Carousel images={images} />
                    </div>
                    <div className="col-span-5">
                        <h1 className="text-2xl mb-8">{product.title}</h1>

                        <div>
                            <div className="text-3xl font-semibold">
                                <CurrencyFormatter amount={computedProduct.price} />
                            </div>
                        </div>

                        {/*<pre>{JSON.stringify(product.images, undefined, 2)}</pre>*/}
                        {renderProductVariationTypes()}

                        {computedProduct.quantity != undefined &&
                            computedProduct.quantity < 10 &&
                            <div className="text-error my-4">
                                <span>{computedProduct.quantity} left</span>
                            </div>
                        }

                        {renderAddToCartButton()}

                        <b className="text-xl">About the item</b>
                        <div className="wysiwyg-output" dangerouslySetInnerHTML={{__html: product.description}}/>

                    </div>
                </div>
            </div>
        </>

    );
}

export default Show;
