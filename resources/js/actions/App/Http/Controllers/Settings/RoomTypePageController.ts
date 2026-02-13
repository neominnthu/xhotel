import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\RoomTypePageController::index
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:18
 * @route '/settings/room-types'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/room-types',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\RoomTypePageController::index
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:18
 * @route '/settings/room-types'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\RoomTypePageController::index
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:18
 * @route '/settings/room-types'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\RoomTypePageController::index
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:18
 * @route '/settings/room-types'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\RoomTypePageController::index
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:18
 * @route '/settings/room-types'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\RoomTypePageController::index
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:18
 * @route '/settings/room-types'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\RoomTypePageController::index
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:18
 * @route '/settings/room-types'
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
* @see \App\Http\Controllers\Settings\RoomTypePageController::store
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:42
 * @route '/settings/room-types'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/room-types',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\RoomTypePageController::store
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:42
 * @route '/settings/room-types'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\RoomTypePageController::store
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:42
 * @route '/settings/room-types'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\RoomTypePageController::store
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:42
 * @route '/settings/room-types'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\RoomTypePageController::store
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:42
 * @route '/settings/room-types'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Settings\RoomTypePageController::update
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:78
 * @route '/settings/room-types/{roomType}'
 */
export const update = (args: { roomType: number | { id: number } } | [roomType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/room-types/{roomType}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\RoomTypePageController::update
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:78
 * @route '/settings/room-types/{roomType}'
 */
update.url = (args: { roomType: number | { id: number } } | [roomType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { roomType: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { roomType: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    roomType: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        roomType: typeof args.roomType === 'object'
                ? args.roomType.id
                : args.roomType,
                }

    return update.definition.url
            .replace('{roomType}', parsedArgs.roomType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\RoomTypePageController::update
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:78
 * @route '/settings/room-types/{roomType}'
 */
update.patch = (args: { roomType: number | { id: number } } | [roomType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\RoomTypePageController::update
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:78
 * @route '/settings/room-types/{roomType}'
 */
    const updateForm = (args: { roomType: number | { id: number } } | [roomType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\RoomTypePageController::update
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:78
 * @route '/settings/room-types/{roomType}'
 */
        updateForm.patch = (args: { roomType: number | { id: number } } | [roomType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Settings\RoomTypePageController::destroy
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:112
 * @route '/settings/room-types/{roomType}'
 */
export const destroy = (args: { roomType: number | { id: number } } | [roomType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/room-types/{roomType}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\RoomTypePageController::destroy
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:112
 * @route '/settings/room-types/{roomType}'
 */
destroy.url = (args: { roomType: number | { id: number } } | [roomType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { roomType: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { roomType: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    roomType: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        roomType: typeof args.roomType === 'object'
                ? args.roomType.id
                : args.roomType,
                }

    return destroy.definition.url
            .replace('{roomType}', parsedArgs.roomType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\RoomTypePageController::destroy
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:112
 * @route '/settings/room-types/{roomType}'
 */
destroy.delete = (args: { roomType: number | { id: number } } | [roomType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Settings\RoomTypePageController::destroy
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:112
 * @route '/settings/room-types/{roomType}'
 */
    const destroyForm = (args: { roomType: number | { id: number } } | [roomType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\RoomTypePageController::destroy
 * @see app/Http/Controllers/Settings/RoomTypePageController.php:112
 * @route '/settings/room-types/{roomType}'
 */
        destroyForm.delete = (args: { roomType: number | { id: number } } | [roomType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const RoomTypePageController = { index, store, update, destroy }

export default RoomTypePageController