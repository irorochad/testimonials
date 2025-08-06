/**
 * Utility functions for generating unique 6-character slugs
 */

/**
 * Generate a random 6-character alphanumeric slug
 */
export function generateSlug(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

/**
 * Generate a unique slug by checking against existing slugs
 */
export async function generateUniqueSlug(
    checkFunction: (slug: string) => Promise<boolean>
): Promise<string> {
    let attempts = 0
    const maxAttempts = 10

    while (attempts < maxAttempts) {
        const slug = generateSlug()
        const exists = await checkFunction(slug)

        if (!exists) {
            return slug
        }

        attempts++
    }

    // If we can't find a unique slug after 10 attempts, add timestamp
    const timestamp = Date.now().toString(36).slice(-2)
    return generateSlug().slice(0, 4) + timestamp
}

/**
 * Validate slug format (6 characters, alphanumeric only)
 */
export function isValidSlug(slug: string): boolean {
    return /^[a-z0-9]{6}$/.test(slug)
}