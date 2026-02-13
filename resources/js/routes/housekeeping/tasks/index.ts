import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Housekeeping\HousekeepingPageController::store
 * @see app/Http/Controllers/Housekeeping/HousekeepingPageController.php:19
 * @route '/housekeeping/tasks'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/housekeeping/tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Housekeeping\HousekeepingPageController::store
 * @see app/Http/Controllers/Housekeeping/HousekeepingPageController.php:19
 * @route '/housekeeping/tasks'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Housekeeping\HousekeepingPageController::store
 * @see app/Http/Controllers/Housekeeping/HousekeepingPageController.php:19
 * @route '/housekeeping/tasks'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Housekeeping\HousekeepingPageController::store
 * @see app/Http/Controllers/Housekeeping/HousekeepingPageController.php:19
 * @route '/housekeeping/tasks'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Housekeeping\HousekeepingPageController::store
 * @see app/Http/Controllers/Housekeeping/HousekeepingPageController.php:19
 * @route '/housekeeping/tasks'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Housekeeping\HousekeepingPageController::update
 * @see app/Http/Controllers/Housekeeping/HousekeepingPageController.php:47
 * @route '/housekeeping/tasks/{task}'
 */
export const update = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/housekeeping/tasks/{task}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Housekeeping\HousekeepingPageController::update
 * @see app/Http/Controllers/Housekeeping/HousekeepingPageController.php:47
 * @route '/housekeeping/tasks/{task}'
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
* @see \App\Http\Controllers\Housekeeping\HousekeepingPageController::update
 * @see app/Http/Controllers/Housekeeping/HousekeepingPageController.php:47
 * @route '/housekeeping/tasks/{task}'
 */
update.patch = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Housekeeping\HousekeepingPageController::update
 * @see app/Http/Controllers/Housekeeping/HousekeepingPageController.php:47
 * @route '/housekeeping/tasks/{task}'
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
* @see \App\Http\Controllers\Housekeeping\HousekeepingPageController::update
 * @see app/Http/Controllers/Housekeeping/HousekeepingPageController.php:47
 * @route '/housekeeping/tasks/{task}'
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
/**
* @see \App\Http\Controllers\Housekeeping\HousekeepingPageController::exportMethod
 * @see app/Http/Controllers/Housekeeping/HousekeepingPageController.php:77
 * @route '/housekeeping/tasks.csv'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/housekeeping/tasks.csv',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Housekeeping\HousekeepingPageController::exportMethod
 * @see app/Http/Controllers/Housekeeping/HousekeepingPageController.php:77
 * @route '/housekeeping/tasks.csv'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Housekeeping\HousekeepingPageController::exportMethod
 * @see app/Http/Controllers/Housekeeping/HousekeepingPageController.php:77
 * @route '/housekeeping/tasks.csv'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Housekeeping\HousekeepingPageController::exportMethod
 * @see app/Http/Controllers/Housekeeping/HousekeepingPageController.php:77
 * @route '/housekeeping/tasks.csv'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Housekeeping\HousekeepingPageController::exportMethod
 * @see app/Http/Controllers/Housekeeping/HousekeepingPageController.php:77
 * @route '/housekeeping/tasks.csv'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Housekeeping\HousekeepingPageController::exportMethod
 * @see app/Http/Controllers/Housekeeping/HousekeepingPageController.php:77
 * @route '/housekeeping/tasks.csv'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Housekeeping\HousekeepingPageController::exportMethod
 * @see app/Http/Controllers/Housekeeping/HousekeepingPageController.php:77
 * @route '/housekeeping/tasks.csv'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
const tasks = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
export: Object.assign(exportMethod, exportMethod),
}

export default tasks