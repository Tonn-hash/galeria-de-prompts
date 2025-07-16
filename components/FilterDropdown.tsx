"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SlidersHorizontal } from "lucide-react"

interface FilterDropdownProps {
  categories: string[]
  selectedCategories: string[]
  onCategoryChange: (category: string, checked: boolean) => void
}

export function FilterDropdown({ categories, selectedCategories, onCategoryChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filtros
          {selectedCategories.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-purple-600 text-white rounded-full text-xs">
              {selectedCategories.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-gray-900 text-white border-gray-700 rounded-lg shadow-lg p-2"
        align="start"
        forceMount
      >
        <div className="px-2 py-1.5 text-sm font-semibold text-gray-300">Categorias</div>
        <div className="max-h-60 overflow-y-auto">
          {categories.map((category) => (
            <DropdownMenuItem
              key={category}
              className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-700 rounded-md"
            >
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => onCategoryChange(category, !!checked)}
                className="border-gray-500 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
              />
              <Label htmlFor={`category-${category}`} className="text-sm font-normal text-gray-200 cursor-pointer">
                {category}
              </Label>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
