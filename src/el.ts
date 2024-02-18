export type Attr = Record<string, string | (string | HTMLElement)[]>

export const el = (name: string, { children, ...attr }: Attr = {}) => {
    const elem = document.createElement(name)

    Object.entries(attr as Record<string, string>).forEach(([k, v]) => {
        elem.setAttribute(k, v)
    })
    elem.append(...(children || []))

    return elem
}

export const $ = new Proxy(
    {} as Record<
        string,
        (attr: Attr) => HTMLElement
    >,
    {
        get(_target, prop, _receiver) {
            if (typeof prop == "string") {
                return (attr: Attr) => el(prop, attr)
            }
            return true
        }
    }
)