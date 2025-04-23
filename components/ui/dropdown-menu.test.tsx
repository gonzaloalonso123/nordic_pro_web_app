import { describe, it, expect, vi } from 'vitest'
import { render, screen, setupUser } from '@/test/utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from './dropdown-menu'

describe('DropdownMenu', () => {
  it('renders trigger button correctly', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    
    const trigger = screen.getByText('Open Menu')
    expect(trigger).toBeInTheDocument()
  })

  it('opens menu when trigger is clicked', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    
    const user = setupUser()
    const trigger = screen.getByText('Open Menu')
    
    // Menu content should not be visible initially
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
    
    // Click the trigger to open the menu
    await user.click(trigger)
    
    // Menu items should now be visible
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('handles checkbox items correctly', async () => {
    const onCheckedChange = vi.fn()
    
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem onCheckedChange={onCheckedChange}>
            Checkbox Item
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    
    const user = setupUser()
    const trigger = screen.getByText('Open Menu')
    
    // Open the menu
    await user.click(trigger)
    
    // Click the checkbox item
    const checkboxItem = screen.getByText('Checkbox Item')
    await user.click(checkboxItem)
    
    // Check that onCheckedChange was called
    expect(onCheckedChange).toHaveBeenCalledTimes(1)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('handles radio items correctly', async () => {
    const onValueChange = vi.fn()
    
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="option1" onValueChange={onValueChange}>
            <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    
    const user = setupUser()
    const trigger = screen.getByText('Open Menu')
    
    // Open the menu
    await user.click(trigger)
    
    // Click the second radio item
    const radioItem = screen.getByText('Option 2')
    await user.click(radioItem)
    
    // Check that onValueChange was called with the correct value
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange).toHaveBeenCalledWith('option2')
  })
})