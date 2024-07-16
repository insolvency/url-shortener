import { Config, JsonDB } from "node-json-db";
import { env } from "../env";
import type { IStorage, ShortenedUrl } from "./IStorage";
import ShortUniqueId from "short-unique-id";

export class JsonStorage implements IStorage {
	uid: ShortUniqueId = new ShortUniqueId({ length: env.SHORTEN_LENGTH });
	db: JsonDB;

	constructor() {
		// Should never happen because of zod validation on .env
		if (env.DATASOURCE_PATH === undefined)
			throw new Error(
				"Cannot use json storage because DATASOURCE_PATH is undefined.",
			);

		this.db = new JsonDB(new Config(env.DATASOURCE_PATH, true, true, "/"));

		this.db.exists("/shortened").then((exists) => {
			if (!exists) this.db.push("/shortened", []);
		});
	}

	public async addUrl(url: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const shortenedTo = this.uid.rnd();

			this.db
				.push(
					"/shortened[]",
					{
						url: url,
						shortenedTo,
						views: 0,
					} as ShortenedUrl,
					true,
				)
				.then(() => resolve(shortenedTo))
				.catch((err) => reject(err));
		});
	}

	public async getUrl(shortenedTo: string): Promise<ShortenedUrl | undefined> {
		const shortenedUrl = await this.db.getObject<ShortenedUrl[]>("/shortened");
		return shortenedUrl.find(
			(shortenedUrl) => shortenedUrl.shortenedTo === shortenedTo,
		);
	}

	public async getAllUrls(): Promise<ShortenedUrl[]> {
		return this.db.getObject<ShortenedUrl[]>("/shortened");
	}

	public async addView(shortenedTo: string) {
		let urls = await this.getAllUrls();

		urls = urls.map((su) =>
			su.shortenedTo === shortenedTo ? { ...su, views: su.views + 1 } : su,
		);

		return this.db.push("/shortened", urls, true);
	}
}
