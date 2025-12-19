'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, generateSlug, type BlogPostRow, type BlogPostInsert, type BlogPostUpdate } from '../lib/supabase'
import { toast } from 'sonner'

// Query keys
const BLOGS_KEY = ['blog_posts']

// Extended type with category name from join
export interface BlogPostWithCategory extends BlogPostRow {
  category_name?: string | null
}

/**
 * Fetch all blog posts from Supabase with category names
 */
async function fetchBlogs(): Promise<BlogPostWithCategory[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      blog_categories (
        name
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching blogs:', error)
    throw error
  }

  // Transform the data to flatten the category name
  return (data || []).map(blog => ({
    ...blog,
    category_name: blog.blog_categories?.name || null,
    blog_categories: undefined
  })) as BlogPostWithCategory[]
}

/**
 * Create a new blog post in Supabase
 */
async function createBlog(blog: BlogPostInsert): Promise<BlogPostRow> {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(blog)
    .select()
    .single()

  if (error) {
    console.error('Error creating blog:', error)
    throw error
  }

  return data
}

/**
 * Update an existing blog post in Supabase
 */
async function updateBlog({ id, ...updates }: BlogPostUpdate & { id: string }): Promise<BlogPostRow> {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating blog:', error)
    throw error
  }

  return data
}

/**
 * Delete a blog post from Supabase
 */
async function deleteBlog(id: string): Promise<void> {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting blog:', error)
    throw error
  }
}

/**
 * React hook for blog posts CRUD operations
 */
export function useBlogs() {
  const queryClient = useQueryClient()

  // Query for fetching blogs
  const query = useQuery({
    queryKey: BLOGS_KEY,
    queryFn: fetchBlogs,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  })

  // Mutation for creating a blog
  const createMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOGS_KEY })
      toast.success('Blog post created successfully')
    },
    onError: (error) => {
      toast.error(`Failed to create blog post: ${error.message}`)
    }
  })

  // Mutation for updating a blog
  const updateMutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOGS_KEY })
      toast.success('Blog post updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update blog post: ${error.message}`)
    }
  })

  // Mutation for deleting a blog
  const deleteMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOGS_KEY })
      toast.success('Blog post deleted successfully')
    },
    onError: (error) => {
      toast.error(`Failed to delete blog post: ${error.message}`)
    }
  })

  return {
    // Data
    blogs: query.data || [],
    isLoading: query.isLoading,
    error: query.error,

    // Operations
    createBlog: createMutation.mutateAsync,
    updateBlog: updateMutation.mutateAsync,
    deleteBlog: deleteMutation.mutateAsync,

    // Operation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Refetch
    refetch: query.refetch
  }
}

/**
 * Helper to convert legacy blog format to BlogPostInsert
 */
export function convertLegacyBlog(blog: {
  id?: string
  title: string
  excerpt: string
  category: string
  content?: string
}): BlogPostInsert {
  return {
    slug: generateSlug(blog.title),
    title: blog.title,
    excerpt: blog.excerpt,
    content: blog.content || blog.excerpt,
    category_id: null, // Will be set based on category lookup
    featured_image_url: null,
    meta_title: null,
    meta_description: null,
    meta_keywords: null,
    canonical_url: null,
    reading_time_minutes: Math.ceil((blog.content || blog.excerpt).split(' ').length / 200),
    view_count: 0,
    status: 'published',
    is_featured: false,
    published_at: new Date().toISOString()
  }
}
