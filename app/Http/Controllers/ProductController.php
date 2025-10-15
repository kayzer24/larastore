<?php

namespace App\Http\Controllers;

use App\Filament\Resources\Products\Pages\ListProducts;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Resources\ProductListResource;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::query()
            ->published()
            ->paginate(12);

        return Inertia::render('welcome', [
            'products' => ProductListResource::collection($products)
        ]);
    }

    public function show(Product $product)
    {
//        return Inertia::render('welcome', [
//            'product' => $product,
//            'create_url' => route('product.show'),
//        ]);

    }
}
