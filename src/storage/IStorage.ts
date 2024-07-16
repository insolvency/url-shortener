export interface IStorage {
	addUrl: (url: string) => string;
	getUrl: (shortenedUrl: string) => string | undefined;
	getUrlViews: (shortenedUrl: string) => number | undefined;
	addView: (shortenedUrl: string) => void;
}
