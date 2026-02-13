import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\SystemBackupController::store
 * @see app/Http/Controllers/Api/SystemBackupController.php:14
 * @route '/api/v1/system/backups'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/system/backups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\SystemBackupController::store
 * @see app/Http/Controllers/Api/SystemBackupController.php:14
 * @route '/api/v1/system/backups'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\SystemBackupController::store
 * @see app/Http/Controllers/Api/SystemBackupController.php:14
 * @route '/api/v1/system/backups'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\SystemBackupController::store
 * @see app/Http/Controllers/Api/SystemBackupController.php:14
 * @route '/api/v1/system/backups'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\SystemBackupController::store
 * @see app/Http/Controllers/Api/SystemBackupController.php:14
 * @route '/api/v1/system/backups'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const SystemBackupController = { store }

export default SystemBackupController