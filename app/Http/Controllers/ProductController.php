<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductListResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::query()
            ->forWebsite()
            ->paginate(12);

        return Inertia::render('welcome', [
            'products' => ProductListResource::collection($products)
        ]);
    }

    public function show(Product $product): Response
    {
        return Inertia::render('product/show', [
            'product' => new ProductResource($product),
            'variationOptions' => request('options', []),
        ]);

    }
}
