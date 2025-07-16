"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowDownWideNarrow } from "lucide-react"

interface SortDropdownProps {
  sortBy: string
  onSortChange: (value: string) => void
}

export function SortDropdown({ sortBy, onSortChange }: SortDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <ArrowDownWideNarrow className="mr-2 h-4 w-4" />
          Ordenar por: {sortBy === "recent" ? "Mais Recentes" : "Mais Antigos"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-gray-900 text-white border-gray-700 rounded-lg shadow-lg p-2" align="end">
        <DropdownMenuItem
          onClick={() => onSortChange("recent")}
          className="cursor-pointer hover:bg-gray-700 rounded-md px-3 py-2 text-sm"
        >
          Mais Recentes
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onSortChange("oldest")}
          className="cursor-pointer hover:bg-gray-700 rounded-md px-3 py-2 text-sm"
        >
          Mais Antigos
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
