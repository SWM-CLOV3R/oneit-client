import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"

const Header = () => {
  return (
    <header className="flex min-h-[5svh] w-full items-center justify-between px-4 md:px-6 shadow-md py-1">
      <div className="">
        <a href="/" className="flex items-center justify-center">
          <span className="text-black text-3xl font-Bayon">One!t</span>
        </a>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="ml-auto">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          {/* todo: connect pages */}
          <div className="grid gap-4 p-6">
            <a href="/" >
              Home
            </a>
            <a href="#">
              About
            </a>
            <a href="#" >
              Products
            </a>
            <a href="#" >
              Contact
            </a>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export default Header