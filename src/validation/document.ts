import * as z from "zod";

export const documentSchema = z.object({
  name: z.string().min(1, {
    message: "Document name is required",
  }),
  size: z.number().min(1, {
    message: "File size must be greater than 0",
  }),
  type: z.string().refine(
    (type) => {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      return allowedTypes.includes(type);
    },
    {
      message: "Only PDF, DOCX, and TXT files are allowed",
    }
  ),
});

export const documentFileSchema = z.instanceof(File).refine(
  (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    return allowedTypes.includes(file.type);
  },
  {
    message: "Only PDF, DOCX, and TXT files are allowed",
  }
).refine(
  (file) => file.size > 0,
  {
    message: "File must be greater than 0 bytes",
  }
);

export type DocumentValidation = z.infer<typeof documentSchema>;
