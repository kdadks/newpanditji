'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, BookRow, BookInsert, BookUpdate, generateSlug } from '../lib/supabase'

const QUERY_KEY = 'books'

// Fetch all books (for admin)
async function fetchBooks(): Promise<BookRow[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching books:', error)
    throw new Error(error.message)
  }

  return data || []
}

// Fetch published books (for public display)
async function fetchPublishedBooks(): Promise<BookRow[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching published books:', error)
    throw new Error(error.message)
  }

  return data || []
}

// Fetch featured books
async function fetchFeaturedBooks(): Promise<BookRow[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching featured books:', error)
    throw new Error(error.message)
  }

  return data || []
}

// Fetch a single book by slug
async function fetchBookBySlug(slug: string): Promise<BookRow | null> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    console.error('Error fetching book by slug:', error)
    throw new Error(error.message)
  }

  return data
}

// Create a new book
async function createBook(book: Omit<BookInsert, 'slug'>): Promise<BookRow> {
  const slug = generateSlug(book.title)
  
  const { data, error } = await supabase
    .from('books')
    .insert({ ...book, slug })
    .select()
    .single()

  if (error) {
    console.error('Error creating book:', error)
    throw new Error(error.message)
  }

  return data
}

// Update an existing book
async function updateBook({ id, ...book }: { id: string } & BookUpdate): Promise<BookRow> {
  // Generate new slug if title is being updated
  const updateData = book.title 
    ? { ...book, slug: generateSlug(book.title) }
    : book

  const { data, error } = await supabase
    .from('books')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating book:', error)
    throw new Error(error.message)
  }

  return data
}

// Delete a book
async function deleteBook(id: string): Promise<void> {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting book:', error)
    throw new Error(error.message)
  }
}

// Hook to fetch all books (admin)
export function useBooks() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchBooks,
  })
}

// Hook to fetch published books (public)
export function usePublishedBooks() {
  return useQuery({
    queryKey: [QUERY_KEY, 'published'],
    queryFn: fetchPublishedBooks,
  })
}

// Hook to fetch featured books
export function useFeaturedBooks() {
  return useQuery({
    queryKey: [QUERY_KEY, 'featured'],
    queryFn: fetchFeaturedBooks,
  })
}

// Hook to fetch a single book by slug
export function useBookBySlug(slug: string) {
  return useQuery({
    queryKey: [QUERY_KEY, 'slug', slug],
    queryFn: () => fetchBookBySlug(slug),
    enabled: !!slug,
  })
}

// Hook to create a book
export function useCreateBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

// Hook to update a book
export function useUpdateBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

// Hook to delete a book
export function useDeleteBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}
