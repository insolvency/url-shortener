import type { NextFunction, Request, Response } from "express";

export const secretKeyValidation =
	(secretKey: string) => (req: Request, res: Response, next: NextFunction) => {
		const headerContent = req.headers.authorization;
		if (headerContent === secretKey) next();
		else return res.sendStatus(401);
	};
