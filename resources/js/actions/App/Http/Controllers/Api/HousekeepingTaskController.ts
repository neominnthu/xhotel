import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::index
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:21
 * @route '/api/v1/housekeeping/tasks'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/housekeeping/tasks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::index
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:21
 * @route '/api/v1/housekeeping/tasks'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::index
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:21
 * @route '/api/v1/housekeeping/tasks'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::index
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:21
 * @route '/api/v1/housekeeping/tasks'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::index
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:21
 * @route '/api/v1/housekeeping/tasks'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::index
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:21
 * @route '/api/v1/housekeeping/tasks'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::index
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:21
 * @route '/api/v1/housekeeping/tasks'
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
* @see \App\Http\Controllers\Api\HousekeepingTaskController::store
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:60
 * @route '/api/v1/housekeeping/tasks'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/housekeeping/tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::store
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:60
 * @route '/api/v1/housekeeping/tasks'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::store
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:60
 * @route '/api/v1/housekeeping/tasks'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::store
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:60
 * @route '/api/v1/housekeeping/tasks'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::store
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:60
 * @route '/api/v1/housekeeping/tasks'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::bulkUpdate
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:115
 * @route '/api/v1/housekeeping/tasks/bulk'
 */
export const bulkUpdate = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: bulkUpdate.url(options),
    method: 'patch',
})

bulkUpdate.definition = {
    methods: ["patch"],
    url: '/api/v1/housekeeping/tasks/bulk',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::bulkUpdate
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:115
 * @route '/api/v1/housekeeping/tasks/bulk'
 */
bulkUpdate.url = (options?: RouteQueryOptions) => {
    return bulkUpdate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::bulkUpdate
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:115
 * @route '/api/v1/housekeeping/tasks/bulk'
 */
bulkUpdate.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: bulkUpdate.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::bulkUpdate
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:115
 * @route '/api/v1/housekeeping/tasks/bulk'
 */
    const bulkUpdateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkUpdate.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::bulkUpdate
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:115
 * @route '/api/v1/housekeeping/tasks/bulk'
 */
        bulkUpdateForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkUpdate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    bulkUpdate.form = bulkUpdateForm
/**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::update
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:91
 * @route '/api/v1/housekeeping/tasks/{task}'
 */
export const update = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/api/v1/housekeeping/tasks/{task}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::update
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:91
 * @route '/api/v1/housekeeping/tasks/{task}'
 */
update.url = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { task: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { task: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    task: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        task: typeof args.task === 'object'
                ? args.task.id
                : args.task,
                }

    return update.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::update
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:91
 * @route '/api/v1/housekeeping/tasks/{task}'
 */
update.patch = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::update
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:91
 * @route '/api/v1/housekeeping/tasks/{task}'
 */
    const updateForm = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\HousekeepingTaskController::update
 * @see app/Http/Controllers/Api/HousekeepingTaskController.php:91
 * @route '/api/v1/housekeeping/tasks/{task}'
 */
        updateForm.patch = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const HousekeepingTaskController = { index, store, bulkUpdate, update }

export default HousekeepingTaskController