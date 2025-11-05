import { Product } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import CurrencyFormatter from '@/components/currency-formatter';
import { show } from '@/routes/product';
import cart from '@/routes/cart';

function ProductItem({ product }: { product: Product }) {
    const form = useForm<{
        option_ids: Record<string, number>;
        quantity: number;
    }>({
        option_ids: {},
        quantity: 1,
    });
    const addToCart = () => {
        form.post(cart.store.url(product.id), {
            preserveScroll: true,
            preserveState: true,
            onError: (err) => {
                console.log(err);
            },
        });
    };

    return (
        <div className="card bg-base-100 shadow-xl">
            <Link href={show(product.slug)}>
                <figure>
                    <img
                        src={product.image}
                        alt={product.title}
                        className="aspect-square object-cover"
                    />
                </figure>
            </Link>
            <div className="card-body">
                <h2 className="card-title">{product.title}</h2>
                <p>
                    By{' '}
                    <Link href={"/"} className="hover:underline">
                        {product.user.name}
                    </Link>
                    &nbsp;in <Link href={'/'} className="hover:underline">
                        {product.department.name}
                    </Link>
                </p>
                <div className="mt-3 card-actions items-center justify-between">
                    <button onClick={addToCart} className="btn btn-primary">Add to Cart</button>
                    <span className="text-2xl">
                        <CurrencyFormatter amount={product.price} />
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ProductItem;
