import express, { type Request, type Response } from "express";
import { env } from "./env";
import type { IStorage } from "./storage/IStorage";
import { MemoryStorage } from "./storage/MemoryStorage";
import { validateRequest } from "./middleware/validateRequest";
import { getShortenedUrlValidator } from "./middleware/validators/getShortenedUrlValidator";
import { shortenUrlValidator } from "./middleware/validators/shortenUrlValidator";

const app = express();
const urlStorage: IStorage = new MemoryStorage();

app.use(express.json({ limit: "5MB" }));

app.post(
	"/shorten",
	validateRequest(shortenUrlValidator),
	(
		req: Request<
			Record<string, unknown>,
			Record<string, unknown>,
			{ url: string }
		>,
		res: Response,
	) => {
		const url = req.body.url;
		const shortenedUrl = urlStorage.addUrl(url);

		return res.send({ shortened: `${env.BASE_URL}s/${shortenedUrl}` });
	},
);

app.get(
	"/s/:id",
	validateRequest(getShortenedUrlValidator),
	(req: Request<{ id: string }>, res: Response) => {
		const id = req.params.id;
		const shortenedUrl = urlStorage.getUrl(id);

		if (shortenedUrl === undefined)
			return res.status(400).send({ msg: "Invalid shortened URL" });

		urlStorage.addView(id);
		return res.redirect(shortenedUrl.url);
	},
);

app.get("/", (req: Request, res: Response) => {
	let html =
		"<html><head><style>table, th, td { border: 1px solid black; } th, td { padding: 5px; }</style></head><body><table><tr><th>URL</th><th>Shortened To</th><th>Views</th></tr>";

	for (const url of urlStorage.getAllUrls()) {
		html += `<tr><td>${url.url}</td><td>${url.shortenedTo}</td><td>${url.views}</td></tr>`;
	}

	html += "</table></body></html>";

	res.send(html);
});

app.listen(env.PORT, () => console.log(`Listening on port ${env.PORT}.`));
