import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RoomInventoryPageController::index
 * @see app/Http/Controllers/RoomInventoryPageController.php:14
 * @route '/room-inventory'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/room-inventory',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RoomInventoryPageController::index
 * @see app/Http/Controllers/RoomInventoryPageController.php:14
 * @route '/room-inventory'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoomInventoryPageController::index
 * @see app/Http/Controllers/RoomInventoryPageController.php:14
 * @route '/room-inventory'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RoomInventoryPageController::index
 * @see app/Http/Controllers/RoomInventoryPageController.php:14
 * @route '/room-inventory'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RoomInventoryPageController::index
 * @see app/Http/Controllers/RoomInventoryPageController.php:14
 * @route '/room-inventory'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RoomInventoryPageController::index
 * @see app/Http/Controllers/RoomInventoryPageController.php:14
 * @route '/room-inventory'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RoomInventoryPageController::index
 * @see app/Http/Controllers/RoomInventoryPageController.php:14
 * @route '/room-inventory'
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
const RoomInventoryPageController = { index }

export default RoomInventoryPageController