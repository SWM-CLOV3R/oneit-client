import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ShareProps {
    title: string
    text: string
    url: string
}

const Share = (props: ShareProps) => {
    const {title, text, url} = props

    const onShare = async () => {
        if(navigator.canShare(props)){
            await navigator.share({
                title,
                text,
                url
            })
        }else{
            console.log('Web Share API not supported');
        }
    }

    return (
        <Button variant="ghost" onClick={onShare}>
            <Share2/>
        </Button>
    )
}

export default Share