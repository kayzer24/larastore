<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Resources\Products\ProductResource;
use Filament\Actions\DeleteAction;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Resources\Pages\EditRecord;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

class ProductImages extends EditRecord
{
    protected static ?string $navigationLabel = 'Images';

    protected static string|null|\BackedEnum $navigationIcon = Heroicon::OutlinedPhoto;

    protected static string $resource = ProductResource::class;

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            SpatieMediaLibraryFileUpload::make('images')
            ->image()
            ->multiple()
            ->openable()
            ->panelLayout('grid')
            ->collection('images')
            ->reorderable()
            ->appendFiles()
            ->preserveFilenames()
            ->columnSpan(2)
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
