import CurrencyFormatter from '@/components/currency-formatter';
import cart from '@/routes/cart';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import product from '@/routes/product';
import { productRoute } from '@/helpers';

function MiniCartDropdown() {
    const { totalQuantity, totalPrice, miniCartItems } = usePage<SharedData>().props;

    return (
        <div className="dropdown dropdown-center">
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
                        {totalQuantity}
                    </span>
                </div>
            </div>
            <div
                tabIndex={0}
                className="dropdown-content card card-compact z-1 mt-3 w-[380px] bg-base-100 shadow"
            >
                <div className="card-body">
                    <span className="text-lg font-bold">
                        {totalQuantity} Items
                    </span>

                    <div className="my-4 max-h-[300px] overflow-auto">
                        {miniCartItems.length === 0 && (
                            <div className="py-2 text-gray-500 text-center">
                                You don't have any items yet.
                            </div>
                        )}
                        {miniCartItems.map((item) => (
                            <div key={item.id} className='flex gap-4 p-3'>
                                <Link href={productRoute(item)} className="w-16 h-16 flex justify-center items-center">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="max-w-full max-h-full"
                                    />
                                </Link>
                                <div className="flex-1">
                                    <h3 className="mb-3 font-semibold">
                                        <Link href={productRoute(item)}>
                                            {item.title}
                                        </Link>
                                    </h3>
                                    <div className="flex justify-between text-sm">
                                        <div>
                                            Quantity: {item.quantity}
                                        </div>
                                        <div>
                                            <CurrencyFormatter amount={item.quantity * item.price} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <span className="text-primary text-lg">
                        Subtotal: <CurrencyFormatter amount={totalPrice} />
                    </span>

                    <div className="card-actions">
                        <Link
                            href={cart.index()}
                            className="btn btn-block btn-primary"
                        >
                            View cart
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MiniCartDropdown;
