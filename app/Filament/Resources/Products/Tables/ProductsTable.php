<?php

namespace App\Filament\Resources\Products\Tables;

use App\Enums\ProductStatusEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Facades\Filament;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        $columns = [
            SpatieMediaLibraryImageColumn::make('images')
                ->collection('images')
                ->limit(1)
                ->label('Image')
                ->conversion('thumb'),
            TextColumn::make('title')
                ->sortable()
                ->words(10)
                ->searchable(),
            TextColumn::make('status')
                ->badge()
                ->colors(ProductStatusEnum::colors()),
            TextColumn::make('department.name'),
            TextColumn::make('category.name'),
            TextColumn::make('created_at')->date(),
        ];
        if (Filament::auth()->user()?->hasRole('Admin')) {
            $columns[] = TextColumn::make('user.name')
                ->label('Created By')
                ->sortable()
                ->searchable();
        }

        return $table
            ->columns($columns)
            ->filters([
                SelectFilter::make('status')
                    ->options(ProductStatusEnum::labels()),
                SelectFilter::make('department_id')
                    ->relationship('department', 'name')
                    ->multiple(),
                SelectFilter::make('created_by')
                    ->relationship('user', 'name')
                    ->multiple(),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
