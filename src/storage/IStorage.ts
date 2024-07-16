export interface ShortenedUrl {
	url: string;
	shortenedTo: string;
	views: number;
}

export interface IStorage {
	addUrl: (url: string) => Promise<string>;
	getUrl: (shortenedUrl: string) => Promise<ShortenedUrl | undefined>;
	getAllUrls: () => Promise<ShortenedUrl[]>;
	addView: (shortenedUrl: string) => Promise<void>;
}
