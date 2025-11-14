import Navbar from '@/components/front/navbar';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react';
import type { SharedData } from '@/types';
import Footer from '@/components/front/footer';

function AuthenticatedLayout({
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const [successMessages, setSuccessMessages] = useState<any[]>([])
    const timeoutRefs = useRef<{ [key: number]: ReturnType<typeof setTimeout> }>({});
    const { error, success } = usePage<SharedData>().props;

    useEffect(() => {
        if (success.message) {
            const newMessage = {
                ...success,
                id: success.time,
            };
            // add the new message to the list
            setSuccessMessages((prevMessages) => [newMessage, ...prevMessages])

            // set a timeoutId for this specific message
            const timeoutId = setTimeout(() => {
                setSuccessMessages((prevMessages) =>
                    prevMessages.filter((msg) => msg.id !== newMessage.id)
                );
                // clear timeout from refs after execution
                delete timeoutRefs.current[newMessage.id];
            }, 5000);
        }
    }, [success]);



    return (
        <div className="flex flex-col h-screen">
            <Navbar />

            { error && (
                <div className="container mx-auto mt-8 px-8">
                    <div role="alert" className="alert alert-error">
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {successMessages.length > 0 && (
                <div className="toast toast-top toast-end z-[1000] mt-14">
                    {successMessages.map((msg) => (
                        <div className="alert alert-success" key={msg.id}>
                            <span>{msg.message}</span>
                        </div>
                    ))}
                </div>
            )}

            <main>{children}</main>

            <Footer />
        </div>
    );
}

export default AuthenticatedLayout;
