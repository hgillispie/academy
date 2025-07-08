import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Validate API request data against a Zod schema
 * @param request The Next.js API request
 * @param schema The Zod schema to validate against
 * @returns A tuple with the validated data and null, or null and a response error
 */
export async function validateRequest<T extends z.ZodType>(
  request: NextRequest,
  schema: T,
): Promise<[z.infer<T> | null, NextResponse | null]> {
  try {
    // Parse the request body as JSON
    const body = await request.json();

    // Validate the body against the schema
    const result = schema.safeParse(body);

    if (!result.success) {
      // Return validation errors
      return [
        null,
        NextResponse.json(
          {
            success: false,
            error: 'Validation error',
            details: result.error.format(),
          },
          { status: 400 },
        ),
      ];
    }

    // Return the validated data
    return [result.data, null];
  } catch (error) {
    // Handle JSON parsing errors or other exceptions
    return [
      null,
      NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 400 },
      ),
    ];
  }
}

/**
 * Example of how to use validation in an API route:
 *
 * import { validateRequest } from "@/lib/validation";
 * import { z } from "zod";
 *
 * // Define request schema
 * const updateUserSchema = z.object({
 *   name: z.string().min(2),
 *   email: z.string().email(),
 * });
 *
 * export async function POST(request: NextRequest) {
 *   const [data, validationError] = await validateRequest(request, updateUserSchema);
 *
 *   if (validationError) {
 *     return validationError;
 *   }
 *
 *   // Use validated data safely
 *   const { name, email } = data;
 *
 *   // Process the request...
 * }
 */
