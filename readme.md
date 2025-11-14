## Quick Start
#### Install all dependencies
```
npm install
```
#### Start the Laravel queue
```
php artisan queue:listen
```
### Launch the project
#### with Herd
```
npm run dev
```
#### without Herd 
```
composer run dev
```

### Run the Laravel queue for image handler
```
php artisan queue:listen
```

### Test Stripe Webhooks using the CLI
```
// Connect the stripe dashboard to the cli
stripe login

// listen to the stripe wehbook
stripe listen --forward-to larastore.test/stripe/webhook
```
ensure the webhook secret is up to date in the .env file


## Libraries:
### PHP
- [Laravel](https://laravel.com/docs/12.x)
- [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission/v6/introduction)
- [Spatie Media Library](https://filamentphp.com/plugins/filament-spatie-media-library#installation)
- [Laravel filament](https://filamentphp.com/docs/4.x/introduction/overview)

### Node
- [DaisyUI](https://daisyui.com/docs/intro/)


## Annexe:
- [Blade Icons](https://blade-ui-kit.com/blade-icons)
- [vue-daisyui-starter-kit](https://github.com/ludoguenet/vue-daisyui-starter-kit/tree/main)

## Training
- [Build Multi Vendor E-Commerce Marketplace with Laravel & React](https://www.youtube.com/watch?v=1Vj73iP_7vk&t=3561s)
