import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Folios\FolioPageController::store
 * @see app/Http/Controllers/Folios/FolioPageController.php:32
 * @route '/folios/{folio}/payments'
 */
export const store = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/folios/{folio}/payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Folios\FolioPageController::store
 * @see app/Http/Controllers/Folios/FolioPageController.php:32
 * @route '/folios/{folio}/payments'
 */
store.url = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { folio: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { folio: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    folio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        folio: typeof args.folio === 'object'
                ? args.folio.id
                : args.folio,
                }

    return store.definition.url
            .replace('{folio}', parsedArgs.folio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Folios\FolioPageController::store
 * @see app/Http/Controllers/Folios/FolioPageController.php:32
 * @route '/folios/{folio}/payments'
 */
store.post = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Folios\FolioPageController::store
 * @see app/Http/Controllers/Folios/FolioPageController.php:32
 * @route '/folios/{folio}/payments'
 */
    const storeForm = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Folios\FolioPageController::store
 * @see app/Http/Controllers/Folios/FolioPageController.php:32
 * @route '/folios/{folio}/payments'
 */
        storeForm.post = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const payments = {
    store: Object.assign(store, store),
}

export default payments