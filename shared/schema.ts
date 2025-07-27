import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull().default("standalone"), // standalone, vscode-integration, existing-project
  template: text("template"),
  content: json("content").$type<ProjectContent>().notNull().default({}),
  settings: json("settings").$type<ProjectSettings>().notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  thumbnail: text("thumbnail"),
  content: json("content").$type<TemplateContent>().notNull(),
  tags: text("tags").array(),
  isBuiltIn: boolean("is_built_in").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pages = pgTable("pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  name: text("name").notNull(),
  path: text("path").notNull(),
  content: json("content").$type<PageContent>().notNull().default({}),
  meta: json("meta").$type<PageMeta>().notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type definitions for JSON fields
export interface ProjectContent {
  pages?: Array<{
    id: string;
    name: string;
    path: string;
    content: PageContent;
  }>;
  assets?: Array<{
    id: string;
    name: string;
    path: string;
    type: string;
  }>;
  styles?: {
    global: string;
    components: Record<string, string>;
  };
}

export interface ProjectSettings {
  responsive?: {
    breakpoints: Record<string, number>;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  deployment?: {
    type?: "cpanel" | "ftp" | "manual";
    config?: Record<string, any>;
  };
  vscode?: {
    workspacePath?: string;
    targetFiles?: string[];
  };
}

export interface TemplateContent {
  structure: Array<ComponentDefinition>;
  styles: string;
  scripts?: string;
  meta?: {
    title?: string;
    description?: string;
  };
}

export interface PageContent {
  structure: Array<ComponentDefinition>;
  styles?: string;
  scripts?: string;
}

export interface PageMeta {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  viewport?: string;
}

export interface ComponentDefinition {
  id: string;
  type: string;
  tag?: string;
  content?: string;
  attributes?: Record<string, any>;
  styles?: Record<string, any>;
  children?: Array<ComponentDefinition>;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Component definition schema with lazy evaluation for children
const baseComponentSchema = z.object({
  id: z.string(),
  type: z.string(),
  tag: z.string().optional(),
  content: z.string().optional(),
  attributes: z.record(z.any()).optional(),
  styles: z.record(z.any()).optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number()
  }).optional()
});

export const componentDefinitionSchema: z.ZodType<ComponentDefinition> = baseComponentSchema.extend({
  children: z.lazy(() => z.array(componentDefinitionSchema)).optional()
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  description: true,
  type: true,
  template: true,
}).extend({
  name: z.string().min(1, "Project name is required"),
  type: z.enum(["standalone", "vscode-integration", "existing-project"]),
});

export const insertTemplateSchema = createInsertSchema(templates).pick({
  name: true,
  description: true,
  category: true,
  thumbnail: true,
  content: true,
  tags: true,
}).extend({
  name: z.string().min(1, "Template name is required"),
  category: z.string().min(1, "Category is required"),
});

export const insertPageSchema = createInsertSchema(pages).pick({
  projectId: true,
  name: true,
  path: true,
  content: true,
  meta: true,
}).extend({
  name: z.string().min(1, "Page name is required"),
  path: z.string().min(1, "Page path is required"),
});

export const updateProjectSchema = insertProjectSchema.partial();
export const updatePageSchema = insertPageSchema.omit({ projectId: true }).partial();

// Inferred types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type UpdateProject = z.infer<typeof updateProjectSchema>;

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pages.$inferSelect;
export type UpdatePage = z.infer<typeof updatePageSchema>;
