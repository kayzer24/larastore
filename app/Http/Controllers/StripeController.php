<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Http\Resources\OrderViewResource;
use App\Mail\CheckoutCompleted;
use App\Mail\NewOrderMail;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Stripe\Exception\SignatureVerificationException;
use Stripe\StripeClient;
use Stripe\Webhook;

class StripeController extends Controller
{
    public function success(Request $request): Response
    {
        $user = auth()->user();
        $session_id = $request->get('session_id');
        $orders = Order::where('stripe_session_id', $session_id)
            ->get();

        if ($orders->count() === 0) {
            abort(404);
        }

        foreach ($orders as $order) {
            if ($order->user_id !== $user->id) {
                abort(403);
            }
        }

        return Inertia::render('stripe/success', [
            'orders' => OrderViewResource::collection($orders)->collection->toArray()
        ]);
    }

    public function failure()
    {

    }

    public function webhook(Request $request)
    {
        $stripe = new StripeClient(config('app.stripe_secret_key'));

        $webhook_secret = config('app.stripe_webhook_secret');
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $event = null;

        try {
            $event = Webhook::constructEvent($payload, $sig_header, $webhook_secret);
        } catch (\UnexpectedValueException $e) {
            Log::error($e);
            return response('Invalid Payload', 400);
        } catch (SignatureVerificationException $e) {
            Log::error($e);
            return response('Invalid Payload', 400);
        }

        switch ($event->type) {
            case 'charge.updated':
                $charge = $event->data->object;
                $transactionId = $charge['balance_transaction'];
                $payment_intent = $charge['payment_intent'];
                $balanceTransaction = $stripe->balanceTransactions->retrieve($transactionId);

                $orders = Order::where('payment_intent', $payment_intent)->get();

                $totalAmount = $balanceTransaction['amount'];
                $stripeFee = 0;

                foreach ($balanceTransaction['fee_details'] as $fee_detail) {
                    if ($fee_detail['type'] === 'stripe_fee') {
                        $stripeFee = $fee_detail['amount'];
                    }
                }

                $platformFeePercent = config('app.platform_fee_pct');
                foreach ($orders as $order) {
                    $vendorShare = $order->total_price / $totalAmount;

                    /** @var Order $order */
                    $order->online_payment_commission = $vendorShare * $stripeFee;
                    $order->website_commission = ($order->total_price - $order->online_payment_commission) / 100 * $platformFeePercent;
                    $order->vendor_subtotal = $order->total_price - $order->online_payment_commission - $order->website_commission;

                    $order->save();

                    // TODO Send email to vendor
                    \Mail::to($order->vendorUser)->send(new NewOrderMail($order));
                }

                // TODO Send Email to buyer
                \Mail::to($orders[0]->user)->send(new CheckoutCompleted($orders));
                break;

            case 'checkout.session.completed':
                $session = $event->data->object;
                $pi = $session['payment_intent'];

                $orders = Order::query()
                    ->with(['orderItems'])
                    ->where(['stripe_session_id' => $session['id']])
                    ->get();

                $productsToDeleteFromCart = [];

                foreach ($orders as $order) {
                    $order->payment_intent = $pi;
                    $order->status = OrderStatusEnum::Paid;
                    $order->save();

                    $productsToDeleteFromCart = [
                        ...$productsToDeleteFromCart,
                        ...$order->orderItems->map(fn($item) => $item->product_id)->toArray(),
                    ];

                    //Reduce product quantity
                    foreach ($order->orderItems as $orderItem) {
                        /** @var OrderItem $orderItem */
                        $options = $orderItem->variation_type_option_ids;
                        $product = $orderItem->product;
                        if ($options) {
                            sort($options);
                            $variation = $product->variations()
                                ->where('variation_type_option_ids', $options)
                                ->first();
                            if ($variation && $variation->quantity != null) {
                                $variation->quantity -= $orderItem->quantity;
                                $variation->save();
                            }
                        } else if ($product->quantity != null) {
                            $product->quantity -= $orderItem->quantity;
                            $product->save();
                        }
                    }
                }

                CartItem::query()
                    ->where('user_id', $order->user_id)
                    ->whereIn('product_id', $productsToDeleteFromCart)
                    ->where('save_for_later', false)
                    ->delete();

                break;
            default:
                echo 'Received an unknown event type ' . $event->type;
                break;
        }

        return response('', 200);
    }

    public function debugWH()
    {
        $stripe = new StripeClient(config('app.stripe_secret_key'));
        $this->checkout_completed_test($stripe);

        $transactionId = 'txn_3STQpVFNAwvkX06o0uZQSKpS';
        $payment_intent = 'pi_3STQpVFNAwvkX06o0JYub1Qq';
        $balanceTransaction = $stripe->balanceTransactions->retrieve($transactionId);

        $orders = Order::where('payment_intent', $payment_intent)->get();

        $totalAmount = $balanceTransaction['amount'];
        $stripeFee = 0;

        foreach ($balanceTransaction['fee_details'] as $fee_detail) {
            if ($fee_detail['type'] === 'stripe_fee') {
                $stripeFee = $fee_detail['amount'];
            }
        }

        $platformFeePercent = config('app.platform_fee_pct');

        foreach ($orders as $order) {
            $vendorShare = $order->total_price / $totalAmount;

            /** @var Order $order */
            $order->online_payment_commission = $vendorShare * $stripeFee;
            $order->website_commission = ($order->total_price - $order->online_payment_commission) / 100 * $platformFeePercent;
            $order->vendor_subtotal = $order->total_price - $order->online_payment_commission - $order->website_commission;

            $order->save();

//             TODO Send email to vendor
//            \Mail::to($order->vendorUser)->send(new NewOrderMail($order));
        }

        // TODO Send Email to buyer
//        \Mail::to($orders[0]->user)->send(new CheckoutCompleted($orders));
    }

    public function checkout_completed_test($stripe)
    {
        $session = $stripe->checkout->sessions->retrieve('cs_test_b1EEuQkpaoWDDewZ8ukGK50lKXG4f3fgPXk8E7oQHOKRx1l2zbLHo5rp0S');
        $pi = $session['payment_intent'];

        $orders = Order::query()
            ->with(['orderItems'])
            ->where(['stripe_session_id' => $session['id']])
            ->get();

        $productsToDeleteFromCart = [];
        foreach ($orders as $order) {
            $order->payment_intent = $pi;
            $order->status = OrderStatusEnum::Paid;
            $order->save();

            $productsToDeleteFromCart = [
                ...$productsToDeleteFromCart,
                ...$order->orderItems->map(fn($item) => $item->product_id)->toArray(),
            ];

            //Reduce product quantity
            foreach ($order->orderItems as $orderItem) {
                /** @var OrderItem $orderItem */
                $options = $orderItem->variation_type_option_ids;
                $product = $orderItem->product;
                if ($options) {
                    sort($options);
                    $variation = $product->variations()
                        ->where('variation_type_option_ids', $options)
                        ->first();
                    if ($variation && $variation->quantity != null) {
                        $variation->quantity -= $orderItem->quantity;
                        $variation->save();
                    }
                } else if ($product->quantity != null) {
                    $product->quantity -= $orderItem->quantity;
                    $product->save();
                }
            }
        }

        CartItem::query()
            ->where('user_id', $order->user_id)
            ->whereIn('product_id', $productsToDeleteFromCart)
            ->where('save_for_later', false)
            ->delete();
    }
}
