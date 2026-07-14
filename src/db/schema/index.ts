export * from "./auth";
export * from "./notes";

import * as authSchema from "./auth";
import * as notesSchema from "./notes";

export const schema = { ...authSchema, ...notesSchema };
