
export const getBaseURL = (url) => {
    const pathSegments = url.split('/')
    const protocol = pathSegments[0]
    const host = pathSegments[2]
    return `${protocol}//${host}`
}
