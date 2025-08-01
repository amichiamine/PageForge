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
  type: text("type").notNull().default("single-page"), // single-page, multi-page, ftp-sync, ftp-upload
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
  content: json("content").$type<PageContent>().notNull().default({structure: []}),
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
  meta?: PageMeta;
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
  ftp?: {
    host?: string;
    username?: string;
    password?: string;
    port?: number;
    directory?: string;
    autoUpload?: boolean;
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
  meta?: PageMeta;
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

// Simple component schema without circular references
export const componentDefinitionSchema = z.object({
  id: z.string(),
  type: z.string(),
  tag: z.string().optional(),
  content: z.string().optional(),
  attributes: z.record(z.any()).optional(),
  styles: z.record(z.any()).optional(),
  children: z.array(z.any()).optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number()
  }).optional()
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  type: z.enum(["single-page", "multi-page", "ftp-sync", "ftp-upload"]),
  template: z.string().optional(),
});

// Specific schema for updating project content
export const updateProjectContentSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  content: z.any().optional(),
});

export const insertTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  thumbnail: z.string().optional(),
  content: z.any(),
  tags: z.array(z.string()).optional(),
});

export const insertPageSchema = z.object({
  projectId: z.string(),
  name: z.string().min(1, "Page name is required"),
  path: z.string().min(1, "Page path is required"),
  content: z.any(),
  meta: z.any().optional(),
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
