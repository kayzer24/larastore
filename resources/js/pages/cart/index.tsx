import CurrencyFormatter from '@/components/currency-formatter';
import Navbar from '@/components/front/navbar';
import { Button } from '@/components/ui/button';
import cart from '@/routes/cart';
import { GroupedCartItems, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CreditCardIcon } from 'lucide-react';
import CartItem from '@/components/front/cart-item';

function Index({
    csrf_token,
    cartItems,
    totalQuantity,
    totalPrice,
}: PageProps<{
    cartItems: Record<number, GroupedCartItems>;
}>) {
    return (
        <>
            <Head title="Your Cart" />
            <Navbar />
            <div className="container mx-auto flex flex-col gap-4 p-8 lg:flex-row">
                <div className="card order-2 flex-1 bg-white lg:order-2 dark:bg-gray-800">
                    <div className="card-body">
                        <h2 className="text-lg font-bold">Shopping Cart</h2>

                        <div className="my-4">
                            {Object.keys(cartItems).length === 0 && (
                                <div className="py-2 text-center text-gray-500">
                                    You don't have any items yet.
                                </div>
                            )}
                            {Object.values(cartItems).map((cartItem) => (
                                <div key={cartItem.user.id}>
                                    <div className="mb-4 flex items-center justify-between border-b border-gray-300 pb-4">
                                        <Link href="/" className="underline">
                                            {cartItem.user.name}
                                        </Link>
                                        <div>
                                            <form
                                                action={cart.checkout().url}
                                                method="post"
                                            >
                                                <input
                                                    type="hidden"
                                                    name={'_token'}
                                                    value={csrf_token}
                                                />
                                                <input
                                                    type="hidden"
                                                    name={'vendor_id'}
                                                    value={cartItem.user.id}
                                                />
                                                <button className="btn btn-ghost btn-sm">
                                                    <CreditCardIcon className="size-6" />
                                                    Pay Only for this seller
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                    {cartItem.items &&
                                        cartItem.items.map((item) => (
                                            <div key={item.id}>
                                                <CartItem item={item} key={item.id} />
                                            </div>
                                        ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="card order-1 bg-white lg:order-2 lg:min-w-[260px] dark:bg-gray-800">
                    <div className="card-body">
                        Subtotal ({totalQuantity} items): &nbsp;
                        <CurrencyFormatter amount={totalPrice} />
                        <form action={cart.checkout().url} method={'post'}>
                            <input
                                type="hidden"
                                name="_token"
                                value={csrf_token}
                            />
                            <Button className="rounded-full">
                                <CreditCardIcon className={'size-6'} />
                                Proceed to checkout
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Index;
