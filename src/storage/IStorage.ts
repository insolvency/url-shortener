export interface ShortenedUrl {
	url: string;
	shortenedTo: string;
	views: number;
}

export interface IStorage {
	addUrl: (url: string) => string;
	getUrl: (shortenedUrl: string) => ShortenedUrl | undefined;
	getAllUrls: () => ShortenedUrl[];
	addView: (shortenedUrl: string) => void;
}
