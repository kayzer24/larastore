import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Modal from '@/components/ui/modal';
import { connect } from '@/routes/stripe';
import vendor from '@/routes/vendor';
import type { SharedData } from '@/types';
import { Textarea } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import React, { FormEventHandler, useState } from 'react';
import { route } from 'ziggy-js';

function VendorDetails({ className = '' }: { className?: string }) {
    const [showBecomeVendorConfirmation, setShowBecomeVendorConfirmation] =
        useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const { auth, csrf_token } = usePage<SharedData>().props;

    const { data, setData, errors, post, processing, recentlySuccessful } =
        useForm({
            store_name: auth.user.vendor?.store_name || auth.user.name.toLowerCase().replace(/\s+/g, '-'),
            store_address: auth.user.vendor?.store_address,
        });

    const onStoreNameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setData(
            'store_name',
            ev.target.value.toLowerCase().replace(/\s+/g, '-'),
        );
    };

    const becomeVendor: FormEventHandler = (ev) => {
        ev.preventDefault();

        post(vendor.store().url, {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                setSuccessMessage('You can now create and publish products.');
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };

    const updateVendor: FormEventHandler = (ev) => {
        ev.preventDefault();

        post(vendor.store().url, {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                setSuccessMessage('Your details were updated.');
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };

    const closeModal = () => {
        setShowBecomeVendorConfirmation(false);
    };

    return (
        <section className={className}>
            {recentlySuccessful && (
                <div className="toast-top toast-end toast">
                    <div className="alert alert-success">
                        <span>{successMessage}</span>
                    </div>
                </div>
            )}

            <header>
                <h2 className="mb-8 flex justify-between text-lg font-medium text-gray-900 dark:text-gray-100">
                    Vendor Details
                    {auth.user.vendor?.status === 'pending' && (
                        <span className={'badge badge-warning'}>
                            {auth.user.vendor?.status_label}
                        </span>
                    )}
                    {auth.user.vendor?.status === 'rejected' && (
                        <span className={'badge badge-error'}>
                            {auth.user.vendor?.status_label}
                        </span>
                    )}
                    {auth.user.vendor?.status === 'approved' && (
                        <span className={'badge badge-success'}>
                            {auth.user.vendor?.status_label}
                        </span>
                    )}
                </h2>
            </header>

            <div>
                {!auth.user.vendor && (
                    <Button
                        onClick={() => setShowBecomeVendorConfirmation(true)}
                        className="btn btn-primary"
                        disabled={processing}
                    >
                        Become a Vendor
                    </Button>
                )}

                {auth.user.vendor && (
                    <>
                        <form onSubmit={updateVendor}>
                            <div className="mb-4">
                                <Label htmlFor="name">Store Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    className="mt-1 block w-full"
                                    value={data.store_name}
                                    onChange={onStoreNameChange}
                                    required
                                    autoFocus
                                    autoComplete="name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.store_name}
                                />
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="address">Store Address</Label>
                                <Textarea
                                    id="address"
                                    className="textarea-bordered textarea mt-1 w-full"
                                    value={data.store_address ?? ''}
                                    onChange={(e) =>
                                        setData('store_address', e.target.value)
                                    }
                                    required
                                    placeholder="Enter Your Store Address"
                                ></Textarea>

                                <InputError
                                    className="mt-2"
                                    message={errors.store_address}
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <Button
                                    className="btn btn-primary"
                                    disabled={processing}
                                >
                                    Update
                                </Button>
                            </div>
                        </form>
                        <form
                            action={connect().url}
                            method={'post'}
                            className={'my-8'}
                        >
                            <Input
                                type={'hidden'}
                                name={'_token'}
                                value={csrf_token}
                            />
                            {auth.user.stripe_account_active && (
                                <div className="my-4 text-center text-sm text-gray-600">
                                    You are successfully connected to Stripe
                                </div>
                            )}
                            <Button
                                className="btn w-full btn-primary"
                                disabled={auth.user.stripe_account_active}
                            >
                                Connect to Stripe
                            </Button>
                        </form>
                    </>
                )}
            </div>

            <Modal
                show={showBecomeVendorConfirmation}
                onClose={() => closeModal()}
            >
                <form className="p-8" onSubmit={becomeVendor}>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Are you sure you want to become a Vendor?
                    </h2>

                    <div className="mt-6 flex justify-end">
                        <Button
                            className="btn btn-secondary"
                            onClick={closeModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="btn ms-3 btn-primary"
                            disabled={processing}
                        >
                            Confirm
                        </Button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}

export default VendorDetails;
