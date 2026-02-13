import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Reservations\ReservationImportPageController::store
 * @see app/Http/Controllers/Reservations/ReservationImportPageController.php:23
 * @route '/reservations/import'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/reservations/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Reservations\ReservationImportPageController::store
 * @see app/Http/Controllers/Reservations/ReservationImportPageController.php:23
 * @route '/reservations/import'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reservations\ReservationImportPageController::store
 * @see app/Http/Controllers/Reservations/ReservationImportPageController.php:23
 * @route '/reservations/import'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Reservations\ReservationImportPageController::store
 * @see app/Http/Controllers/Reservations/ReservationImportPageController.php:23
 * @route '/reservations/import'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Reservations\ReservationImportPageController::store
 * @see app/Http/Controllers/Reservations/ReservationImportPageController.php:23
 * @route '/reservations/import'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const importMethod = {
    store: Object.assign(store, store),
}

export default importMethod