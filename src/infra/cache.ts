class Cache {
	constructor(private cache: Map<string, string> = new Map()) {}

	get(key: string): string | undefined {
		return this.cache.get(key);
	}

	set(key: string, value: string): void {
		this.cache.set(key, value);
	}
}

export const cache = new Cache();
