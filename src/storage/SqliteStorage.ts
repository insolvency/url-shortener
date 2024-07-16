import type { IStorage, ShortenedUrl } from "./IStorage";
import { env } from "../env";
import ShortUniqueId from "short-unique-id";
import { Database } from "sqlite3";

export class SqliteStorage implements IStorage {
	uid: ShortUniqueId = new ShortUniqueId({ length: 10 });
	db: Database;

	constructor() {
		// Should never happen because of zod validation on .env
		if (env.DATASOURCE_PATH === undefined)
			throw new Error(
				"Cannot use sqlite storage because DATASOURCE_PATH is undefined.",
			);

		this.db = new Database(env.DATASOURCE_PATH, (err) => {
			if (err) {
				console.log(err);
				process.exit(1);
			}

			this.db.serialize(() => {
				this.db.run(
					'CREATE TABLE IF NOT EXISTS shortened (url TEXT NOT NULL, shortenedTo TEXT NOT NULL UNIQUE, views INT NOT NULL, PRIMARY KEY("shortenedTo"))',
					(err) => {
						if (err) {
							console.log(err);
							process.exit(1);
						}
					},
				);
			});
		});
	}

	public async addUrl(url: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const shortenedTo = this.uid.rnd();

			this.db.run(
				"INSERT INTO shortened (url, shortenedTo, views) VALUES (?, ?, ?)",
				[url, shortenedTo, 0],
				(err) => {
					if (err) reject(err);
					resolve(shortenedTo);
				},
			);
		});
	}

	public async getUrl(shortenedTo: string): Promise<ShortenedUrl | undefined> {
		return new Promise((resolve, reject) => {
			this.db.get(
				"SELECT * FROM shortened WHERE shortenedTo = ?",
				[shortenedTo],
				(err, row: ShortenedUrl | undefined) => {
					if (err) reject(err);
					resolve(row);
				},
			);
		});
	}

	public async getAllUrls(): Promise<ShortenedUrl[]> {
		return new Promise((resolve, reject) => {
			this.db.all("SELECT * FROM shortened", (err, rows: ShortenedUrl[]) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	}

	public async addView(shortenedTo: string) {
		return new Promise<void>((resolve, reject) => {
			this.db.run(
				"UPDATE shortened SET views = views + 1 WHERE shortenedTo=?",
				[shortenedTo],
				(err) => {
					if (err) reject(err);
					resolve();
				},
			);
		});
	}
}
