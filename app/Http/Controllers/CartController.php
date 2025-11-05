<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(CartService $cartService): Response
    {
        $cartItems = $cartService->getCartItemsGrouped();

        return Inertia::render('cart/index', [
            'cartItems' => $cartItems
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Product $product, CartService $cartService): RedirectResponse
    {
        $request->mergeIfMissing([
            'quantity' => 1,
        ]);

        $data = $request->validate([
            'option_ids' => ['nullable', 'array'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cartService->addItemToCart(
            $product,
            $data['quantity'],
            $data['option_ids'] ?: []
        );

        return back()->with('success', 'Product added to card');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product, CartService $cartService): RedirectResponse
    {
        $request->validate([
            'quantity' => ['integer', 'min:1'],
        ]);

        $optionsIds = $request->input('option_ids') ?: [];
        $quantity = $request->input('quantity');

        $cartService->updateItemQuantity($product->id, $quantity, $optionsIds);

        return back()->with('success', 'Quantity updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Product $product, CartService $cartService): RedirectResponse
    {
        $optionsIds = $request->input('option_ids');

        $cartService->removeItemFromCart($product->id, $optionsIds);

        return back()->with('success', 'Quantity removed from cart');
    }

    public function checkout()
    {

    }
}
