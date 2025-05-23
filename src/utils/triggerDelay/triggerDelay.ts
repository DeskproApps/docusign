export default async function triggerDelay(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}