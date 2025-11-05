import { CartItem as CartItemType} from '@/types';
import { Link, router, useForm } from '@inertiajs/react';
import { productRoute } from '@/helpers';
import React, { useState } from 'react';
import cart from '@/routes/cart';
import CurrencyFormatter from '@/components/currency-formatter';

function CartItem({item}: {item: CartItemType}) {
    const deleteForm = useForm({
        option_ids: item.option_ids
    });

    const [error, setError] = useState('');

    const onDeleteClick = () => {
        deleteForm.delete(cart.destroy(item.product_id).url, {
            preserveScroll: true
        })
    };

    const handleQuantityChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        router.put(cart.update(item.product_id).url, {
            quantity: ev.target.value,
            option_ids: item.option_ids
        }, {
            preserveScroll: true,
            onError: (errors) => {
                setError(Object.values(errors)[0])
            }
        })
    };

    const onSaveForLaterClick = () => {

    }

    return (
        <>
            <div className="flex gap-6 p-3" key={item.id}>
                <Link
                    href={productRoute(item)}
                    className="flex min-h-32 w-32 min-w-32 justify-center self-start"
                >
                    <img
                        src={item.image}
                        alt=""
                        className="max-h-full max-w-full"
                    />
                </Link>
                <div className="flex flex-1 flex-col">
                    <div className="flex-1">
                        <h3 className="mb-3 text-sm font-semibold">
                            <Link href={productRoute(item)}>{item.title}</Link>
                        </h3>
                        <div className="text-xs">
                            {item.options.map((option) => (
                                <div key={option.id}>
                                    <strong className="text-bold">
                                        {option.type.name+ ': '}
                                    </strong>
                                    {option.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="text-sm">Quantity:</div>
                            <div
                                className={error ? 'tooltip-open tooltip tooltip-error' : ''} data-tip={error}>
                                <input type="number" defaultValue={item.quantity} onBlur={handleQuantityChange} className="input input-xs w-10"/>
                            </div>
                            <button onClick={() => onDeleteClick()} className="btn btn-sm btn-ghost">Delete</button>
                            <button onClick={() => onSaveForLaterClick()} className="btn btn-sm btn-ghost">Save for later</button>
                        </div>
                        <div className="font-bold text-lg">
                            <CurrencyFormatter amount={item.price * item.quantity} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CartItem;
