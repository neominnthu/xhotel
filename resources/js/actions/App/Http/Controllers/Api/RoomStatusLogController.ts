import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\RoomStatusLogController::index
 * @see app/Http/Controllers/Api/RoomStatusLogController.php:13
 * @route '/api/v1/rooms/{room}/housekeeping-history'
 */
export const index = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/rooms/{room}/housekeeping-history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RoomStatusLogController::index
 * @see app/Http/Controllers/Api/RoomStatusLogController.php:13
 * @route '/api/v1/rooms/{room}/housekeeping-history'
 */
index.url = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { room: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { room: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    room: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        room: typeof args.room === 'object'
                ? args.room.id
                : args.room,
                }

    return index.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RoomStatusLogController::index
 * @see app/Http/Controllers/Api/RoomStatusLogController.php:13
 * @route '/api/v1/rooms/{room}/housekeeping-history'
 */
index.get = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RoomStatusLogController::index
 * @see app/Http/Controllers/Api/RoomStatusLogController.php:13
 * @route '/api/v1/rooms/{room}/housekeeping-history'
 */
index.head = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RoomStatusLogController::index
 * @see app/Http/Controllers/Api/RoomStatusLogController.php:13
 * @route '/api/v1/rooms/{room}/housekeeping-history'
 */
    const indexForm = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RoomStatusLogController::index
 * @see app/Http/Controllers/Api/RoomStatusLogController.php:13
 * @route '/api/v1/rooms/{room}/housekeeping-history'
 */
        indexForm.get = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RoomStatusLogController::index
 * @see app/Http/Controllers/Api/RoomStatusLogController.php:13
 * @route '/api/v1/rooms/{room}/housekeeping-history'
 */
        indexForm.head = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const RoomStatusLogController = { index }

export default RoomStatusLogController