import { z } from 'zod'

export const createSubServiceCategoryZodValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string(),
    serviceCategoryId: z.string(),
    serviceCategoryName: z.string(),
  }),
  file: z
    .any()
    .refine((file) => !!file, 'Image is required')
    .refine(
      (file) =>
        ['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype),
      'Only JPG, JPEG, PNG images are allowed'
    )
    .refine(
      (file) => file.size <= 2 * 1024 * 1024,
      'Image size must be less than 2MB'
    ),
})
