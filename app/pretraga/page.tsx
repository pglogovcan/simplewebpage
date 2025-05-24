"use client"
import { SearchPageClient } from "./SearchPageClient"
import { useSearchParams } from "next/navigation"

export default function SearchPage() {
  const searchParams = useSearchParams()
  return <SearchPageClient searchParams={searchParams} />
}