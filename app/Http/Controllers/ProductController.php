<?php

namespace App\Http\Controllers;

use App\Http\Resources\DepartmentResource;
use App\Http\Resources\ProductListResource;
use App\Http\Resources\ProductResource;
use App\Models\Department;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $keyword = $request->query('keyword');

        $products = Product::query()
            ->forWebsite()
            ->when($keyword, function ($query, $keyword) {
                $query->where(function ($query) use ($keyword) {
                    $query->where('title', 'LIKE', "%{$keyword}%")
                        ->orWhere('description', 'LIKE', "%{$keyword}%");
                });
            })
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

    public function byDepartment(Request $request, Department $department): Response
    {
        abort_unless($department->active, 404);

        $keyword = $request->query('keyword');
        $products = Product::query()
            ->forWebsite()
            ->where('department_id', $department->id)
            ->when($keyword, function ($query, $keyword) {
                $query->where(function ($query) use ($keyword) {
                    $query->where('title', 'LIKE', "%{$keyword}%")
                        ->orWhere('description', 'LIKE', "%{$keyword}%");
                });
            })->paginate();

        return Inertia::render('department/index', [
            'department' => new DepartmentResource($department),
            'products' => ProductListResource::collection($products),
        ]);
    }
}
