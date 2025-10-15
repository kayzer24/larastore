<?php

namespace App\Filament\Resources\Products\Pages;

use App\Enums\ProductVariationTypeEnum;
use App\Filament\Resources\Products\ProductResource;
use Filament\Actions\DeleteAction;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Pages\EditRecord;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

class ProductVariationTypes extends EditRecord
{
    protected static ?string $navigationLabel = 'Variation Types';

    protected static string|null|\BackedEnum $navigationIcon = Heroicon::OutlinedSwatch;

    protected static string $resource = ProductResource::class;

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            Repeater::make('variationTypes')
                ->hiddenLabel()
                ->relationship()
                ->collapsible()
                ->defaultItems(1)
                ->addActionLabel('Add new variation type')
                ->columns(2)
                ->columnSpan(2)
                ->schema([
                    TextInput::make('name')->required(),
                    Select::make('type')
                        ->options(ProductVariationTypeEnum::labels())
                        ->required(),
                    Repeater::make('options')
                        ->relationship()
                        ->collapsible()
                        ->schema([
                            TextInput::make('name')->columnSpan(2)->required(),
                            SpatieMediaLibraryFileUpload::make('images')
                                ->image()
                                ->multiple()
                                ->openable()
                                ->panelLayout('grid')
                                ->reorderable()
                                ->appendFiles()
                                ->preserveFilenames()
                                ->acceptedFileTypes(['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
                                ->helperText('.pdf, .jpg, .jpeg, .png, .webp')
                                ->columnSpan(3)
                        ])
                        ->columnSpan(2)
                ])
        ]);
    }

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResourceUrl('index');
    }
}
