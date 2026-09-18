/**
 * Sanity CaseStudy schema.
 */
export const caseStudy = {
  name: "caseStudy",
  title: "Case Studies",
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
      name: "clientIndustry",
      title: "Client Industry",
      type: "string",
      description: "e.g., Enterprise Fintech, Logistics & Supply Chain, Healthcare",
    },
    {
      name: "relatedSolution",
      title: "Related Solution",
      type: "reference",
      to: [{ type: "solution" }],
    },
    {
      name: "problemStatement",
      title: "Problem Statement",
      type: "text",
      rows: 4,
      description: "Core engineering challenges and operational bottlenecks",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "solutionArchitecture",
      title: "Solution Architecture",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
          ],
        },
      ],
      description: "Technical architecture, integration details, and system design",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "businessImpact",
      title: "Business Impact",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "metric", title: "Key Metric / Result", type: "string" },
            { name: "label", title: "Metric Label", type: "string" },
            { name: "description", title: "Context / Details", type: "text", rows: 2 },
          ],
        },
      ],
      description: "Quantifiable impact and production outcomes without fabricated claims",
    },
    {
      name: "mainImage",
      title: "Main Media Asset",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "mediaAssets",
      title: "Architecture Diagrams & Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "caption", title: "Caption / Description", type: "string" },
            { name: "alt", title: "Alt Text", type: "string" },
          ],
        },
      ],
    },
    {
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
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
      subtitle: "clientIndustry",
      media: "mainImage",
    },
  },
};
