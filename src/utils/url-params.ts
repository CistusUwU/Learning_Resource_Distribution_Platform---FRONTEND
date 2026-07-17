export function parseEnumParam<T extends string>(
    value: string | null,
    allowed: readonly T[],
    fallback: T
): T {
    return allowed.includes(value as T) ? (value as T) : fallback
}