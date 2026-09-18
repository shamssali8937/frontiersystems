/**
 * Sanity Solution schema.
 */
export const solution = {
  name: "solution",
  title: "Solutions",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "category",
      title: "Category / Pillar",
      type: "string",
      options: {
        list: [
          { title: "AI & Automation", value: "ai-automation" },
          { title: "Digital Products", value: "digital-products" },
          { title: "Business Systems", value: "business-systems" },
          { title: "Infrastructure & Security", value: "infrastructure-security" },
        ],
      },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 2,
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "hero",
      title: "Hero Content",
      type: "object",
      fields: [
        { name: "headline", title: "Headline", type: "string" },
        { name: "subhead", title: "Subhead", type: "text", rows: 2 },
        { name: "ctaText", title: "CTA Button Text", type: "string", initialValue: "Request Consultation" },
      ],
    },
    {
      name: "services",
      title: "Services / Capabilities",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "longDescription",
      title: "Long Description / Architecture Overview",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
        },
      ],
    },
    {
      name: "media",
      title: "Media Asset",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "seo",
      title: "SEO Metadata",
      type: "seo",
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "media",
    },
  },
};
