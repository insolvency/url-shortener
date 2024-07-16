import type { NextFunction, Request, Response } from "express";
import { ZodError, type AnyZodObject } from "zod";

// https://greenydev.com/blog/zod-validation/
export const validateRequest =
	(validator: AnyZodObject) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await validator.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});

			next();
		} catch (err) {
			if (err instanceof ZodError)
				return res.status(400).send({ msg: err.issues[0].message });

			return res.status(500).send({ msg: "Internal error occured." });
		}
	};
