import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AgentSocialLinksProps {
  socialMedia: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
  }
}

export function AgentSocialLinks({ socialMedia }: AgentSocialLinksProps) {
  return (
    <div className="flex space-x-2">
      {socialMedia.facebook && (
        <Button variant="outline" size="icon" asChild>
          <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <Facebook className="h-4 w-4" />
          </a>
        </Button>
      )}

      {socialMedia.instagram && (
        <Button variant="outline" size="icon" asChild>
          <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Instagram className="h-4 w-4" />
          </a>
        </Button>
      )}

      {socialMedia.linkedin && (
        <Button variant="outline" size="icon" asChild>
          <a href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin className="h-4 w-4" />
          </a>
        </Button>
      )}

      {socialMedia.twitter && (
        <Button variant="outline" size="icon" asChild>
          <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <Twitter className="h-4 w-4" />
          </a>
        </Button>
      )}
    </div>
  )
}
