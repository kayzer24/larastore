import CurrencyFormatter from '@/components/currency-formatter';
import Navbar from '@/components/front/navbar';
import Carousel from '@/components/ui/carousel';
import { arraysAreEqual } from '@/helpers';
import cart from '@/routes/cart';
import { PageProps, Product, VariationTypeOption } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useMemo, useState } from 'react';
import AuthenticatedLayout from '@/components/front/authenticated-layout';
import vendor from '@/routes/vendor';
import { byDepartment, show } from '@/routes/product';

function Show({
    product,
    variationOptions,
    name: appName,
}: PageProps<{
    product: Product;
    variationOptions: number[];
}>) {
    const form = useForm<{
        option_ids: Record<string, number>;
        quantity: number;
        price: number | null;
    }>({
        option_ids: {},
        quantity: 1,
        price: null,
    });

    const url = usePage();

    const [selectedOptions, setSelectedOptions] = useState<
        Record<number, VariationTypeOption>
    >([]);

    const images = useMemo(() => {
        for (const typeId in selectedOptions) {
            const option = selectedOptions[typeId];
            if (option.images.length > 0) return option.images;
        }

        return product.images;
    }, [product, selectedOptions]);

    const computedProduct = useMemo(() => {
        const selectedOptionIds = Object.values(selectedOptions)
            .map((op) => op.id)
            .sort();

        for (const variation of product.variations) {
            const optionIds = variation.variation_type_option_ids.sort();

            if (arraysAreEqual(selectedOptionIds, optionIds)) {
                return {
                    price: variation.price,
                    quantity:
                        variation.quantity === null
                            ? Number.MAX_VALUE
                            : variation.quantity,
                };
            }
        }
        return {
            price: product.price,
            quantity: product.quantity,
        };
    }, [product, selectedOptions]);

    useEffect(() => {
        for (const type of product.variationTypes) {
            const selectedOptionId: number = variationOptions[type.id];
            console.log(selectedOptionId, type.options);
            chooseOption(
                type.id,
                type.options.find((op) => op.id == selectedOptionId) ||
                    type.options[0],
                false,
            );
        }
    }, []);

    const getOptionIdsMap = (newOptions: object) => {
        return Object.fromEntries(
            Object.entries(newOptions).map(([a, b]) => [a, b.id]),
        );
    };

    const chooseOption = (
        typeId: number,
        option: VariationTypeOption,
        updateRouter: boolean = true,
    ) => {
        setSelectedOptions((prevSelectedOptions) => {
            const newOptions = {
                ...prevSelectedOptions,
                [typeId]: option,
            };

            if (updateRouter) {
                router.get(
                    url.url,
                    {
                        options: getOptionIdsMap(newOptions),
                    },
                    {
                        preserveScroll: true,
                        preserveState: true,
                    },
                );
            }

            return newOptions;
        });
    };

    const onQuantityChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
        form.setData('quantity', parseInt(ev.target.value));
    };

    const addToCart = () => {
        form.post(cart.store.url(product.id), {
            preserveScroll: true,
            preserveState: true,
            onError: (err) => {
                console.log(err);
            },
        });
    };

    const renderProductVariationTypes = () => {
        return product.variationTypes.map((type) => (
            <div key={type.id}>
                <b>{type.name}</b>
                {type.type === 'Image' && (
                    <div className="mb-4 flex gap-2">
                        {type.options.map((option) => (
                            <div
                                key={option.id}
                                onClick={() => chooseOption(type.id, option)}
                            >
                                {option.images && option.images.length > 0 && (
                                    <img
                                        src={option.images[0].thumb}
                                        alt=""
                                        className={
                                            'w-[50px]' +
                                            (selectedOptions[type.id]?.id ===
                                            option.id
                                                ? 'outline outline-4 outline-primary'
                                                : '')
                                        }
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {type.type === 'Radio' && (
                    <div className="mb-4 join flex">
                        {type.options.map((option) => (
                            <input
                                onChange={() => chooseOption(type.id, option)}
                                key={option.id}
                                className="btn join-item"
                                type="radio"
                                value={option.id}
                                checked={
                                    selectedOptions[type.id]?.id === option.id
                                }
                                name={'variation_type_' + type.id}
                                aria-label={option.name}
                            />
                        ))}
                    </div>
                )}
            </div>
        ));
    };

    const renderAddToCartButton = () => {
        return (
            <div className="mb-8 flex gap-4">
                <select
                    value={form.data.quantity}
                    onChange={onQuantityChange}
                    className="select-bordered select w-full"
                >
                    {Array.from({
                        length: Math.min(10, computedProduct.quantity),
                    }).map((el, i) => (
                        <option value={i + 1} key={i + 1}>
                            Quantity: {i + 1}
                        </option>
                    ))}
                </select>
                <button className="btn btn-primary" onClick={addToCart}>
                    Add to Cart
                </button>
            </div>
        );
    };

    useEffect(() => {
        const idsMap = Object.fromEntries(
            Object.entries(selectedOptions).map(
                ([typeId, option]: [string, VariationTypeOption]) => [
                    typeId,
                    option.id,
                ],
            ),
        );
        console.log(idsMap);
        form.setData('option_ids', idsMap);
    }, [selectedOptions]);

    return (
        <AuthenticatedLayout>
            <Head>
                <title>{product.title}</title>
                <meta name="title" content={product.meta_title} />
                <meta name="description" content={product.meta_description} />
                <link rel="canonical" href={show(product.slug).url} />

                <meta property="og:title" content={product.title} />
                <meta property="og:description" content={product.meta_description} />
                <meta property="og:image" content={images[0]?.small} />
                <meta property="og:url" content={show(product.slug).url} />
                <meta property="og:type" content={"product"} />
                <meta property="og:site_name" content={appName} />
            </Head>

            <div className="container mx-auto p-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="col-span-7">
                        <Carousel images={images} />
                    </div>
                    <div className="col-span-5">
                        <h1 className="text-2xl">{product.title}</h1>

                        <p className="mb-8">
                            By{' '} <Link href={vendor.profile(product.user.store_name)} className="hover:underline">{product.user.name}</Link>
                            &nbsp;in <Link href={byDepartment(product.department.slug)} className="hover:underline">{product.department.name}</Link>
                        </p>

                        <div>
                            <div className="text-3xl font-semibold">
                                <CurrencyFormatter
                                    amount={computedProduct.price}
                                />
                            </div>
                        </div>

                        {/*<pre>{JSON.stringify(product.images, undefined, 2)}</pre>*/}
                        {renderProductVariationTypes()}

                        {computedProduct.quantity != undefined &&
                            computedProduct.quantity < 10 && (
                                <div className="my-4 text-error">
                                    <span>{computedProduct.quantity} left</span>
                                </div>
                            )}

                        {renderAddToCartButton()}

                        <b className="text-xl">About the item</b>
                        <div
                            className="wysiwyg-output"
                            dangerouslySetInnerHTML={{
                                __html: product.description,
                            }}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Show;
