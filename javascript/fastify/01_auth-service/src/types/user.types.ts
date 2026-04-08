import { FromSchema } from "json-schema-to-ts";

export const createUserSchema = {
  body: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: { type: "string" },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 8 },
    },
    additionalProperties: false,
  } as const,
  response: {
    201: {
      type: "object",
      properties: {
        id: { type: "string" },
        message: { type: "string" },
      },
      required: ["id", "message"],
    } as const,
  },
} as const;

export type CreateUserBody = FromSchema<typeof createUserSchema.body>;
