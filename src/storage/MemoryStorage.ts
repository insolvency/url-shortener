import ShortUniqueId from "short-unique-id";
import type { IStorage, ShortenedUrl } from "./IStorage";
import { env } from "../env";

export class MemoryStorage implements IStorage {
	uid: ShortUniqueId = new ShortUniqueId({ length: env.SHORTEN_LENGTH });
	shortenedUrls: ShortenedUrl[] = [];

	public async addUrl(url: string): Promise<string> {
		const shortenedTo = this.uid.rnd();
		this.shortenedUrls.push({
			url,
			shortenedTo,
			views: 0,
		});

		return shortenedTo;
	}

	public async getUrl(shortenedTo: string): Promise<ShortenedUrl | undefined> {
		const shortenedUrl = this.shortenedUrls.find(
			(shortenedUrl) => shortenedUrl.shortenedTo === shortenedTo,
		);

		return shortenedUrl;
	}

	public async getAllUrls(): Promise<ShortenedUrl[]> {
		return this.shortenedUrls;
	}

	public async addView(shortenedTo: string) {
		this.shortenedUrls = this.shortenedUrls.map((su) =>
			su.shortenedTo === shortenedTo ? { ...su, views: su.views + 1 } : su,
		);
	}
}
