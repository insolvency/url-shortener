import ShortUniqueId from "short-unique-id";
import type { IStorage } from "./IStorage";

interface ShortenedUrl {
	url: string;
	shortenedTo: string;
	views: number;
}

export class MemoryStorage implements IStorage {
	uid: ShortUniqueId = new ShortUniqueId({ length: 10 });
	public shortenedUrls: ShortenedUrl[] = [];

	public addUrl(url: string): string {
		const shortenedTo = this.uid.rnd();
		this.shortenedUrls.push({
			url,
			shortenedTo,
			views: 0,
		});

		return shortenedTo;
	}

	public getUrl(shortenedTo: string): string | undefined {
		const shortenedUrl = this.shortenedUrls.find(
			(shortenedUrl) => shortenedUrl.shortenedTo === shortenedTo,
		);

		return shortenedUrl?.url;
	}

	public getUrlViews(shortenedTo: string): number | undefined {
		const shortenedUrl = this.shortenedUrls.find(
			(shortenedUrl) => shortenedUrl.shortenedTo === shortenedTo,
		);

		return shortenedUrl?.views;
	}

	public addView(shortenedTo: string) {
		this.shortenedUrls = this.shortenedUrls.map((su) =>
			su.shortenedTo === shortenedTo ? { ...su, views: su.views + 1 } : su,
		);
	}
}
