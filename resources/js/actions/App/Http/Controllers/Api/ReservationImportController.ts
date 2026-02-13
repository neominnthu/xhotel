import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ReservationImportController::store
 * @see app/Http/Controllers/Api/ReservationImportController.php:12
 * @route '/api/v1/reservations/import'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/reservations/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ReservationImportController::store
 * @see app/Http/Controllers/Api/ReservationImportController.php:12
 * @route '/api/v1/reservations/import'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReservationImportController::store
 * @see app/Http/Controllers/Api/ReservationImportController.php:12
 * @route '/api/v1/reservations/import'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ReservationImportController::store
 * @see app/Http/Controllers/Api/ReservationImportController.php:12
 * @route '/api/v1/reservations/import'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ReservationImportController::store
 * @see app/Http/Controllers/Api/ReservationImportController.php:12
 * @route '/api/v1/reservations/import'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const ReservationImportController = { store }

export default ReservationImportController