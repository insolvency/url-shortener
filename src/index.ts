import express, { type Request, type Response } from "express";
import { env } from "./env";
import type { IStorage } from "./storage/IStorage";
import { MemoryStorage } from "./storage/MemoryStorage";
import { validateRequest } from "./middleware/validateRequest";
import { getShortenedUrlValidator } from "./middleware/validators/getShortenedUrlValidator";
import { shortenUrlValidator } from "./middleware/validators/shortenUrlValidator";
import { SqliteStorage } from "./storage/SqliteStorage";

const app = express();
const urlStorage: IStorage =
	env.DATASOURCE_PROVIDER === "sqlite"
		? new SqliteStorage()
		: new MemoryStorage();

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

		urlStorage
			.addUrl(url)
			.then((shortenedUrl) =>
				res.send({ shortened: `${env.BASE_URL}s/${shortenedUrl}` }),
			)
			.catch((err) => {
				console.log(err);
				res.status(500).send({ msg: "Internal server error" });
			});
	},
);

app.get(
	"/s/:id",
	validateRequest(getShortenedUrlValidator),
	async (req: Request<{ id: string }>, res: Response) => {
		const id = req.params.id;

		urlStorage
			.getUrl(id)
			.then((shortenedUrl) => {
				if (shortenedUrl === undefined)
					return res.status(400).send({ msg: "Invalid shortened URL" });

				// Still redirect the user even if the database fails to increment the view count.
				urlStorage
					.addView(id)
					.catch((err) => console.log(err))
					.finally(() => res.redirect(shortenedUrl.url));
			})
			.catch((err) => {
				console.log(err);
				res.status(500).send({ msg: "Internal server error" });
			});
	},
);

app.get("/", async (req: Request, res: Response) => {
	urlStorage
		.getAllUrls()
		.then((urls) => {
			let html =
				"<html><head><style>table, th, td { border: 1px solid black; } th, td { padding: 5px; }</style></head><body><table><tr><th>URL</th><th>Shortened To</th><th>Views</th></tr>";

			for (const url of urls) {
				html += `<tr><td>${url.url}</td><td>${url.shortenedTo}</td><td>${url.views}</td></tr>`;
			}

			html += "</table></body></html>";

			res.send(html);
		})
		.catch((err) => {
			console.log(err);
			res.send("<html><body><p>Error loading page</p></body></html>");
		});
});

app.listen(env.PORT, () => console.log(`Listening on port ${env.PORT}.`));
