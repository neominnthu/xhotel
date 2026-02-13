import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reservations\ReservationImportPageController::index
 * @see app/Http/Controllers/Reservations/ReservationImportPageController.php:14
 * @route '/reservations/import'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reservations/import',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reservations\ReservationImportPageController::index
 * @see app/Http/Controllers/Reservations/ReservationImportPageController.php:14
 * @route '/reservations/import'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reservations\ReservationImportPageController::index
 * @see app/Http/Controllers/Reservations/ReservationImportPageController.php:14
 * @route '/reservations/import'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reservations\ReservationImportPageController::index
 * @see app/Http/Controllers/Reservations/ReservationImportPageController.php:14
 * @route '/reservations/import'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reservations\ReservationImportPageController::index
 * @see app/Http/Controllers/Reservations/ReservationImportPageController.php:14
 * @route '/reservations/import'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reservations\ReservationImportPageController::index
 * @see app/Http/Controllers/Reservations/ReservationImportPageController.php:14
 * @route '/reservations/import'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reservations\ReservationImportPageController::index
 * @see app/Http/Controllers/Reservations/ReservationImportPageController.php:14
 * @route '/reservations/import'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
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
const ReservationImportPageController = { index, store }

export default ReservationImportPageController