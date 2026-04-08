import { FromSchema } from "json-schema-to-ts";

/**
 * Explicit JSON Schema with 'as const' for literal type inference
 */
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
export type CreateUserReply = FromSchema<
  (typeof createUserSchema.response)[201]
>;
