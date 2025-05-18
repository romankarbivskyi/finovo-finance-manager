import { z } from "zod";

export const ITEMS_PER_PAGE = 10;
export const currencyEnum = z.enum(["USD", "EUR", "UAH"]);
