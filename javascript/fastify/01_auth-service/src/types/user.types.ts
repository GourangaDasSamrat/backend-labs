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

export const loginUserSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string" },
    },
    additionalProperties: false,
  } as const,
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
      required: ["message"],
    } as const,
  },
} as const;

export type CreateUserBody = FromSchema<typeof createUserSchema.body>;
export type LoginUserBody = FromSchema<typeof loginUserSchema.body>;
