export async function waitFor(ms: number) {
    return new Promise((res) => {
        setTimeout(() => res(undefined), ms)
    })
}