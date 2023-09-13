// @ts-expect-error
export function load({ request }) {
    console.log(request)
    return {};
}