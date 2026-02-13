import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import charges from './charges'
import payments from './payments'
import refunds from './refunds'
/**
 * @see routes/web.php:352
 * @route '/folios/{folio}'
 */
export const show = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/folios/{folio}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:352
 * @route '/folios/{folio}'
 */
show.url = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{folio}', parsedArgs.folio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see routes/web.php:352
 * @route '/folios/{folio}'
 */
show.get = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
 * @see routes/web.php:352
 * @route '/folios/{folio}'
 */
show.head = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
 * @see routes/web.php:352
 * @route '/folios/{folio}'
 */
    const showForm = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
 * @see routes/web.php:352
 * @route '/folios/{folio}'
 */
        showForm.get = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
 * @see routes/web.php:352
 * @route '/folios/{folio}'
 */
        showForm.head = (args: { folio: number | { id: number } } | [folio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const folios = {
    show: Object.assign(show, show),
charges: Object.assign(charges, charges),
payments: Object.assign(payments, payments),
refunds: Object.assign(refunds, refunds),
}

export default folios