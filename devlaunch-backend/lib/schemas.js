// zod schemas for (1) request bodies and (2) the JSON we expect back from the LLM.
// LLM output is untrusted: anything that doesn't match these shapes is retried
// or rejected, never passed straight to the client or the database.

const { z } = require('zod')

const shortText = (max) => z.string().trim().min(1).max(max)

// ---- Request bodies -------------------------------------------------------

const requests = {
  suggest: z.object({
    step: z.coerce.number().int().min(1).max(6),
    data: shortText(500),
  }),
  chat: z.object({
    message: shortText(2000),
    history: z
      .array(
        z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string().max(4000),
        })
      )
      .max(50)
      .optional()
      .default([]),
  }),
  mvp: z.object({
    idea: shortText(1000),
  }),
  marketing: z.object({
    business_type: shortText(120),
    // The marketing form only requires name + industry; location is optional.
    location: z.string().trim().max(120).optional().default('India').transform(v => v || 'India'),
    industry: shortText(120),
  }),
  proposal: z.object({
    project_id: z.coerce.number().int().positive(),
  }),
}

// ---- LLM outputs ----------------------------------------------------------

const money = z.coerce.number().nonnegative().max(1e9)

const mvpPlan = z.object({
  app_name: shortText(80),
  tagline: shortText(200),
  features: z.array(shortText(300)).min(3).max(12),
  pages: z.array(shortText(150)).min(3).max(15),
  stack: z.object({
    frontend: shortText(80),
    backend: shortText(80),
    database: shortText(80),
    auth: shortText(80),
    hosting: shortText(80),
  }),
  timeline: z
    .array(z.object({ phase: shortText(40), task: shortText(200) }))
    .min(2)
    .max(12),
  cost: z
    .object({ min: money, max: money, currency: z.string().default('INR') })
    .refine(c => c.max >= c.min, { message: 'cost.max must be >= cost.min' }),
  complexity: z.enum(['low', 'medium', 'high']),
})

const marketingPlan = z.object({
  seo_keywords: z.array(shortText(100)).min(3).max(12),
  instagram_posts: z
    .array(z.object({ day: shortText(20), caption: shortText(500), hashtags: z.string().max(300) }))
    .min(1)
    .max(7),
  google_ads: z.object({
    headline1: shortText(60),
    headline2: shortText(60),
    description: shortText(160),
    cta: shortText(40),
  }),
  email_subject: shortText(150),
  email_preview: shortText(250),
})

const proposal = z.object({
  scope: z.array(shortText(300)).min(3).max(15),
  timeline: z
    .array(z.object({ week: shortText(40), task: shortText(200) }))
    .min(2)
    .max(12),
  cost: z
    .array(z.object({ item: shortText(100), amount: money }))
    .min(2)
    .max(15),
  stack: z.object({
    frontend: shortText(80),
    backend: shortText(80),
    database: shortText(80),
    cloud: shortText(80),
  }),
  // The model's total is ignored; the server recomputes it from `cost`.
  total: z.any().optional(),
})

module.exports = { requests, outputs: { mvpPlan, marketingPlan, proposal } }
