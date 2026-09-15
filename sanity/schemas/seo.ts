/**
 * Reusable SEO fields for Sanity documents.
 */
export const seo = {
  name: "seo",
  title: "SEO & Social",
  type: "object",
  fields: [
    {
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "Overrides default page title (recommended: 50-60 chars)",
      validation: (Rule: { max: (limit: number) => unknown }) => Rule.max(70),
    },
    {
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "Overrides default description (recommended: 140-160 chars)",
      validation: (Rule: { max: (limit: number) => unknown }) => Rule.max(180),
    },
    {
      name: "openGraphImage",
      title: "Social Share Image (OG)",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "noIndex",
      title: "No Index",
      type: "boolean",
      description: "Prevent search engines from indexing this page",
      initialValue: false,
    },
  ],
};
