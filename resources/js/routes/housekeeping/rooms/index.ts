import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Housekeeping\RoomHistoryPageController::show
 * @see app/Http/Controllers/Housekeeping/RoomHistoryPageController.php:16
 * @route '/housekeeping/rooms/{room}'
 */
export const show = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/housekeeping/rooms/{room}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Housekeeping\RoomHistoryPageController::show
 * @see app/Http/Controllers/Housekeeping/RoomHistoryPageController.php:16
 * @route '/housekeeping/rooms/{room}'
 */
show.url = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Housekeeping\RoomHistoryPageController::show
 * @see app/Http/Controllers/Housekeeping/RoomHistoryPageController.php:16
 * @route '/housekeeping/rooms/{room}'
 */
show.get = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Housekeeping\RoomHistoryPageController::show
 * @see app/Http/Controllers/Housekeeping/RoomHistoryPageController.php:16
 * @route '/housekeeping/rooms/{room}'
 */
show.head = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Housekeeping\RoomHistoryPageController::show
 * @see app/Http/Controllers/Housekeeping/RoomHistoryPageController.php:16
 * @route '/housekeeping/rooms/{room}'
 */
    const showForm = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Housekeeping\RoomHistoryPageController::show
 * @see app/Http/Controllers/Housekeeping/RoomHistoryPageController.php:16
 * @route '/housekeeping/rooms/{room}'
 */
        showForm.get = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Housekeeping\RoomHistoryPageController::show
 * @see app/Http/Controllers/Housekeeping/RoomHistoryPageController.php:16
 * @route '/housekeeping/rooms/{room}'
 */
        showForm.head = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Housekeeping\RoomHistoryPageController::exportMethod
 * @see app/Http/Controllers/Housekeeping/RoomHistoryPageController.php:47
 * @route '/housekeeping/rooms/{room}/history.csv'
 */
export const exportMethod = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/housekeeping/rooms/{room}/history.csv',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Housekeeping\RoomHistoryPageController::exportMethod
 * @see app/Http/Controllers/Housekeeping/RoomHistoryPageController.php:47
 * @route '/housekeeping/rooms/{room}/history.csv'
 */
exportMethod.url = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return exportMethod.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Housekeeping\RoomHistoryPageController::exportMethod
 * @see app/Http/Controllers/Housekeeping/RoomHistoryPageController.php:47
 * @route '/housekeeping/rooms/{room}/history.csv'
 */
exportMethod.get = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Housekeeping\RoomHistoryPageController::exportMethod
 * @see app/Http/Controllers/Housekeeping/RoomHistoryPageController.php:47
 * @route '/housekeeping/rooms/{room}/history.csv'
 */
exportMethod.head = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Housekeeping\RoomHistoryPageController::exportMethod
 * @see app/Http/Controllers/Housekeeping/RoomHistoryPageController.php:47
 * @route '/housekeeping/rooms/{room}/history.csv'
 */
    const exportMethodForm = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Housekeeping\RoomHistoryPageController::exportMethod
 * @see app/Http/Controllers/Housekeeping/RoomHistoryPageController.php:47
 * @route '/housekeeping/rooms/{room}/history.csv'
 */
        exportMethodForm.get = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Housekeeping\RoomHistoryPageController::exportMethod
 * @see app/Http/Controllers/Housekeeping/RoomHistoryPageController.php:47
 * @route '/housekeeping/rooms/{room}/history.csv'
 */
        exportMethodForm.head = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
const rooms = {
    show: Object.assign(show, show),
export: Object.assign(exportMethod, exportMethod),
}

export default rooms